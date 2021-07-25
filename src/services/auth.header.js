import {LOCAL_STORAGE_USER} from "../components/Shared/XadrogaConstants";

export default function authHeader() {
  const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER));

  if (user && user.token) {
    return { "Authorization": user.token };
  } else {
    return {};
  }
}
