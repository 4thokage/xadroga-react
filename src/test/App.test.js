import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from '../components/navbar/navbar-ext';
import Home from '../components/home/home';
import Footer from '../components/footer/footer';
import Login from '../components/Login/login';
import Register from '../components/register/register';
import Profile from '../components/profile/profile';
import Lobby from '../components/lobby/lobby';
import NotFound from '../components/pagenotfound/page-not-found';
import PrivateRoute from '../components/private/private';
import {Provider} from "react-redux";

import { createStore } from "redux";
import rootReducers from "../store/reducer/index";

const store = createStore(rootReducers);

const renderWithWrappedRouter = ( ui, options ) => {
  return render( ui, {wrapper: Router, ...options });
};

test('renders without crashing', () => {
  renderWithWrappedRouter(<Navbar />);
  render(<Home />);
  render(<Footer />);
  renderWithWrappedRouter(<Login />);
  render(<Register />);
  renderWithWrappedRouter(<Profile />);
  // render( <Provider store={store}><Lobby /></Provider>);
  render(<NotFound />);
  renderWithWrappedRouter(<PrivateRoute />);
});


