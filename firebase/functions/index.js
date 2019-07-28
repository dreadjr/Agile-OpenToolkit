const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

// Listen for changes in all documents in the 'products/members' collection and add it to the users product list
exports.addProductToUserProductList = functions.firestore
    .document('products/{product}/members/{member}')
    .onWrite((change, context) => {
		if(!change.after.exists) {
			return db.collection("users").doc(context.params.member).collection('products').doc(context.params.product).delete()
			.catch(function(error) {
		    	console.error("Error removing document: ", error);
			});
		}

	    let productRef = db.collection('products').doc(context.params.product)

		return db.runTransaction(function(transaction) {
		    return transaction.get(productRef).then(function(doc) {
		        if (!doc.exists) {
		            return
		        }

              	let userProductRef = db.collection('users').doc(context.params.member).collection('products').doc(context.params.product)
		      	return transaction.set(userProductRef, {
		      		name: doc.data().name,
		      		description: doc.data().description,
		      		owner: doc.data().owner
		      	})
		    });
		}).catch(function(error) {
		    console.log("Transaction failed: ", error);
		});

    });

exports.updateProductInfo = functions.firestore
    .document('products/{product}')
    .onUpdate((change, context) => {
    	const newDoc = change.after.data();

    	let productRef = db.collection('products').doc(context.params.product).collection('members')

		return db.runTransaction(function(transaction) {
		    return transaction.get(productRef).then(function(snapshot) {
		        if (!snapshot.exists) {
		            return
		        }

              	return snapshot.forEach(function(member) {
              		let userProductRef = db.collection('users').doc(member.id).collection('products').doc(context.params.product)

              		transaction.update(userProductRef, {
    					name: newDoc.name,
    					description: newDoc.description,
    					owner: newDoc.owner
    				})
              	})
		    });
		}).catch(function(error) {
		    console.log("Transaction failed: ", error);
		});
    });

exports.updateSprints = functions.firestore
	.document('products/{product}/stories/{story}')
    .onWrite((change, context) => {
    	/* Not possible with firestore.........

    	let authorRef = db.collection("users").doc(context.auth.uid)
    	let productRef = db.collection("products").doc(context.params.product).collection("stories").doc(context.params.story)
    	db.runTransaction(function(transaction) {
		    return transaction.get(authorRef).then(function(snapshot) {
		        if (!snapshot.exists) {
		            return
		        }

              	return transaction.update(productRef, {
		    		lastUpdateTimestamp: new Date(),
		    		lastEditer: {
		    			firstname: snapshot.firstname,
		    			lastname: snapshot.lastname,
		    			uid: snapshot.uid
		    		}
		    	})
		    });
		}).catch(function(error) {
		    console.log("Transaction failed: ", error);
		});
		
		*/
		if(!change.before.exists && change.after.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
		} else if(!change.before.exists && change.after.data().status.toLowerCase() === "open") {
			//Do nothing
		} else if(!change.after.exists && change.before.data().status.toLowerCase() === "open") {
			//Do nothing
		} else if(!change.after.exists && change.before.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
		} else if(change.before.data().status.toLowerCase() === "closed" && change.after.data().status.toLowerCase() === "open") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(-1)}, {merge: true})
		} else if(change.before.data().status.toLowerCase() === "open" && change.after.data().status.toLowerCase() === "closed") {
			db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).update({finishedIssues: FieldValue.increment(1)}, {merge: true})
		}

    	//totalIssues++ when a story is created
    	if(!change.before.exists && change.after.data().sprint !== null) {
    		let batch = db.batch();

	    	let storyRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint).collection('stories').doc(context.params.story)
	    	batch.set(storyRef, change.after.data());

	    	let sprintRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
			batch.update(sprintRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

			return batch.commit().catch(function(error) {
				console.error("Error removing document: ", error);
			});
    	}

    	//Nothing happens when the sprint field stays unchanged
    	if(change.after.exists && change.before.exists && change.after.data().sprint === change.before.data().sprint) {
    		return null
    	}

    	//totalIssues-- when a document is deleted or if the sprint field is set to null
    	if(!change.after.exists || (change.after.data().sprint === null && change.before.data().sprint !== null)) {
    		let batch = db.batch();

    		let storyRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint).collection('stories').doc(context.params.story)
    		batch.delete(storyRef)

    		let countRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint)
    		batch.update(countRef, {totalIssues: FieldValue.increment(-1)}, {merge: true})

    		return batch.commit().catch(function(error) {
				console.error("Error removing document: ", error);
			});
    	}

    	//totalIssues++ on new sprint. happens if story exists and has sprint as null, but gets assigned a sprint
    	if(change.after.data().sprint !== null && change.before.data().sprint === null) {
    		let batch = db.batch();

    		let afterStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
			batch.update(afterStoryRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

			return batch.commit().catch(function(error) {
				console.error("Error removing document: ", error);
			});
    	}

    	//totalIssues++ on new sprint and totalIssues-- on old sprint when changing sprint on a story from one sprint to another
    	if(change.after.data().sprint !== null && change.before.data().sprint !== null && change.after.data().sprint !== change.before.data().sprint) {
    		let batch = db.batch();

    		let beforeStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.before.data().sprint)
    		batch.update(beforeStoryRef, {totalIssues: FieldValue.increment(-1)}, {merge: true})

    		let afterStoryRef = db.collection('products').doc(context.params.product).collection('sprints').doc(change.after.data().sprint)
			batch.update(afterStoryRef, {totalIssues: FieldValue.increment(1)}, {merge: true})

			return batch.commit().catch(function(error) {
				console.error("Error removing document: ", error);
			});
    	}

    	return null
    });