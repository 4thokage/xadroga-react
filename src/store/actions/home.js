export const HOME_SET_USERNAME = 'HOME.SET_USERNAME';
export const DASHBOARD_SET_ACTIVE_USERS = 'DASHBOARD.SET_ACTIVE_USERS';
export const DASHBOARD_SET_GROUP_CALL_ROOMS = 'DASHBOARD.SET_GROUP_CALL_ROOMS';

export const setUsername = (username) => {
  return {
    type: HOME_SET_USERNAME,
    username
  };
};

export const setActiveUsers = (activeUsers) => {
  return {
    type: DASHBOARD_SET_ACTIVE_USERS,
    activeUsers
  };
};

export const setGroupCalls = (groupCallRooms) => {
  return {
    type: DASHBOARD_SET_GROUP_CALL_ROOMS,
    groupCallRooms
  };
};
