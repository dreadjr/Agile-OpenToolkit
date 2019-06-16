import { teamConstants } from '../constants/teams';
import { teamService } from '../services/teams';
import { alertActions } from './alert';

export const teamActions = {
  selectTeam
};

function selectTeam (index) {
  return dispatch => {
    teamService.selectTeam(index)
      .then(
        index => {
          dispatch(success(index));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success (user) { return { type: teamConstants.TEAM_SELECT_SUCCESS, index }; }
  function failure (error) { return { type: teamConstants.TEAM_SELECT_FAILURE, error }; }
}