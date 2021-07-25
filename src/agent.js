import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import {API_ROOT} from "./components/Shared/XadrogaConstants";

const superagent = superagentPromise(_superagent, global.Promise);


const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/auth/userinfo'),
  login: (email, password) =>
    requests.post('/auth/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const Games = {
  all: page =>
    requests.get(`/games?${limit(10, page)}`),
  byPlayer: (author, page) =>
    requests.get(`/games?player=${encode(author)}&${limit(5, page)}`),
  get: slug =>
    requests.get(`/games/${slug}`),
  update: game =>
    requests.put(`/games/${game.slug}`, { game: game }),
  create: game =>
    requests.post('/games', { game: game })
};


export default {
  Auth,
  Games,
  setToken: _token => { token = _token; }
};
