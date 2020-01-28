const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const PROGRAMS_URL = `${BASE_URL}/programs`;
const USERS_URL = `${BASE_URL}/users`;
const ACCOUNTS_URL = `${BASE_URL}/accounts`;
const SESSIONS_URL = `${BASE_URL}/sessions`;
let DELETE_URL;
const body = d.querySelector("body");

const main = d.querySelector("main");

const renderNavbar = () => {
  const navbar = d.createElement("navbar");
  body.prepend(navbar);
};

class Button {
  static new(id, innerText, className, callback,url) {
    const button = d.createElement("button");
    button.id = id;
    button.name = id;
    button.innerText = innerText;
    button.className = className;
    button.addEventListener("click", function() {
      callback(url);
    });
    return button;
  }
}

class Input {
  static new(type, name, placeholder) {
    this.input = d.createElement("input");
    this.input.type = type;
    this.input.name = name;
    this.input.placeholder = placeholder;
    return this.input;
  }
}

class Form {
  static new(id, action, method) {
    this.form = d.createElement("form");
    this.form.id = id;
    this.form.action = action;
    this.form.method = method;
    this.form.addEventListener("submit", function(e) {
      e.preventDefault();
      e.target.reset();
    });
    return this.form;
  }
}

const setSession = auth_token => {
  if (sessionStorage.getItem("auth_token")) {
    DELETE_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
  } else {
    sessionStorage.setItem("auth_token", auth_token);
  }
};
d.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
});
