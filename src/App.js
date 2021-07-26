import React, {useCallback, useEffect, Suspense} from 'react';
import {Link, Route, Router, Switch} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import NotFound from './components/Shared/404';
import {useDispatch, useSelector} from "react-redux";
import {clearMessage} from "./store/actions/message";
import {logout} from  "./store/actions/auth";
import EventBus from "./components/Shared/EventBus";
import {history} from "./components/Shared/History";
import {connectWithWebSocket} from "./components/Shared/wssConnection/wssConnection";

function App() {

  const {user: currentUser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    connectWithWebSocket();
  },[]);

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <>
      <Router history={history}>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            Xadroga
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/play"} className="nav-link">
                Play
              </Link>
            </li>
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <Route exact path={["/", "/home"]} component={Home}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/register' component={Register}/>
              <Route exact path='/profile' component={Profile}/>
              {/*<PrivateRoute path='/lobby' component={Lobby}/>*/}
              <Route component={NotFound}/>
            </Switch>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
