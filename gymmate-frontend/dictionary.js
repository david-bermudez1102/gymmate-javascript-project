const d = document;
const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const PROGRAMS_URL = `${BASE_URL}/programs`;
const EXERCISES_URL = `${BASE_URL}/exercises`;
const WORKOUTS_URL = `${BASE_URL}/workouts`;
const USERS_URL = `${BASE_URL}/users`;
const ACCOUNTS_URL = `${BASE_URL}/accounts`;
const SESSIONS_URL = `${BASE_URL}/sessions`;
const SEARCH_URL = `${BASE_URL}/search`;
let SESSION_URL;
if (sessionStorage.getItem("auth_token")) {
  SESSION_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
}

let currentUser = null;

const navbarClass =
  "navbar shadow sticky-top navbar-expand-lg navbar-dark bg-primary solid ";
