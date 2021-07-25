import React, {useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';

import NavBar from './components/navbar/Navbar';
import Home from './components/home/home';
import Login from './components/Login/Login';
import Register from './components/register/register';
import Profile from './components/profile/profile';
// import Lobby from './components/lobby/lobby';
import Confirm from './components/confirm/confirm';
import NotFound from './components/pagenotfound/page-not-found';
import ChangePassword from './components/password/password';


import PrivateRoute from './components/Utils/PrivateRoute';

function App() {
  const [currentUser, setCurrentUser] = useState(null);


  useEffect(() => {
    setCurrentUser(AuthService.getCurrentUser());
  }, [setCurrentUser]);

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  return (
    <>
      <NavBar
        currentUser={currentUser}
        logOut={logout}
      />

      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/confirm' component={Confirm}/>
          <Route exact path='/register' component={Register}/>
          <Route path='/@/:profileId' component={Profile}/>
          <PrivateRoute path='/password' component={ChangePassword}/>
          {/*<PrivateRoute path='/lobby' component={Lobby}/>*/}
          <Route component={NotFound}/>
        </Switch>
      </div>
    </>
  );
}

export default App;
