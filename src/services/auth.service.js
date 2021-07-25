import {LOCAL_STORAGE_USER, LOGIN_URL, REGISTER_URL} from '../components/Shared/XadrogaConstants';
import axios from "axios";

const register = (name, email, password) => {
  return axios.post(REGISTER_URL, {
    name,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(LOGIN_URL, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem(LOCAL_STORAGE_USER);
};

export default {
  register,
  login,
  logout,
};
