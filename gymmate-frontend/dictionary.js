const d = document
const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const PROGRAMS_URL = `${BASE_URL}/programs`;
const USERS_URL = `${BASE_URL}/users`;
const ACCOUNTS_URL = `${BASE_URL}/accounts`;
const SESSIONS_URL = `${BASE_URL}/sessions`;
let DELETE_URL, ACCOUNT_URL;
if (sessionStorage.getItem("auth_token")){
  DELETE_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
  ACCOUNT_URL = `${ACCOUNTS_URL}/${sessionStorage.getItem("auth_token")}`;
}

let currentUser = null;