import {API_ROOT, LOCAL_STORAGE_USER} from '../components/Shared/XadrogaConstants';
import axios from "axios";

const LOGIN_URL = API_ROOT + "/auth/login";
const REGISTER_URL = API_ROOT + "/users";

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
