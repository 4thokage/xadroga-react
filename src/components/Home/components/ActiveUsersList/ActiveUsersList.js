import React from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';
import {connect} from 'react-redux';

import './ActiveUsersList.css';

const ActiveUsersList = ({activeUsers, callState}) => {
  return (activeUsers ?
      <div className='active_user_list_container'>
        {activeUsers.map((activeUser) =>
          <ActiveUsersListItem
            key={activeUser.socketId}
            activeUser={activeUser}
            callState={callState}
          />)}
      </div> : null
  );
}

  const mapStateToProps = ({dashboard, call}) => ({
    ...dashboard,
    ...call
  });

  export default connect(mapStateToProps)(ActiveUsersList);
