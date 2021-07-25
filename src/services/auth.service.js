import axios from 'axios';
import authHeader from './auth.header';

import {API_URL} from '../components/Utils/XadrogaConstants';


class AuthService {
  register(fullname, email, username, password) {
    return axios.post(API_URL + 'register', {
      fullname,
      email,
      username,
      password
    })
      .then(res => {
        if (res.data.success)
          localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      });
  }

  login(email, password) {
    return axios
      .post(API_URL + 'auth/login', {
        email,
        password
      })
      .then(res => {
        if (res.data.success)
          localStorage.setItem('user', JSON.stringify(res.data));
        return res.data;
      }).catch(error => {
        console.log(error);
      });
  }

  logout() {
    localStorage.removeItem('user');
  }


  confirm(userId) {
    return axios.post(API_URL + 'confirm', {
      userId
    }).then(res => res.data);
  }

  changePassword(oldPassword, newPassword, userId) {

    return axios.put(API_URL + 'update-pswd', {
      oldPassword,
      newPassword,
      userId
    }, {
      headers: authHeader()
    }).then(res => res.data);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
