import * as homeActions from '../actions/home';

const initState = {
  username: '',
  activeUsers: [],
  groupCallRooms: []
};

const home = (state = initState, action) => {
  switch (action.type) {
    case homeActions.HOME_SET_USERNAME:
      return {
        ...state,
        username: action.username
      };
    case homeActions.DASHBOARD_SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.activeUsers
      };
    case homeActions.DASHBOARD_SET_GROUP_CALL_ROOMS:
      return {
        ...state,
        groupCallRooms: action.groupCallRooms
      };
    default:
      return state;
  }
};

export default home;
