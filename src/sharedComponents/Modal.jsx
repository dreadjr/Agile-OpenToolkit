import React from 'react';

import styled from 'styled-components'

const Background = styled.div `
    z-index: 1000;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0,  0.5);
    display:flex;
    justify-content:center;
    align-items:center;
`
const Content = styled.div `
    z-index: 1001;
    background-color: white;
    width: 60%;
    height: 60%;
    max-width: ${props => props.maxWidth ? props.maxWidth : "800px"};
    min-width: ${props => props.minWidth ? props.minWidth : "500px"};
    min-height: ${props => props.minHeight ? props.minHeight : "500px"};
    border-radius: 6px;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

class Modal extends React.Component {

    stopBackgroundCall(e) {
        e.stopPropagation();
    }

    render() {
        return (
            <Background onClick={this.props.exitModalCallback}>
                <Content minWidth={this.props.minWidth} maxWidth={this.props.maxWidth} minHeight={this.props.minHeight} onClick={this.stopBackgroundCall}>
                    {this.props.title ? <h1>{this.props.title}</h1> : null}
                    {this.props.content ? (this.props.content instanceof String ? <p>{this.props.content}</p> : this.props.content) : null}
                </Content>
            </Background>
        )
    }
}

export default Modal;