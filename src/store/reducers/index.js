import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import call from "./call";
import home from "./home";

export default combineReducers({
  auth,
  message,
  home,
  call
});
