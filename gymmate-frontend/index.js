const body = d.querySelector("body");
const main = d.querySelector("main");
const container = d.querySelector(".container-fluid.min-vh-100.p-0");

class TextArea {
  static new(name, placeholder, className = "form-control pl-5 rounded-pill") {
    const textArea = d.createElement("textarea");
    textArea.name = name;
    textArea.placeholder = placeholder;
    textArea.className = className;
    return textArea;
  }
}

class FormGroup {
  static new(
    input,
    icon = false,
    className = "form-group row no-gutters flex-nowrap"
  ) {
    const div = d.createElement("div");
    div.className = className;
    if (icon) {
      const btn = Elem.button(
        {
          class:
            "btn h-100 text-primary text-right border-0 mr-n5 ml-2 rounded-pill"
        },
        null,
        icon
      );
      div.append(Column.new(btn, "col-auto", "z-index:2;"));
    }
    const inputColumn = Column.new(input, "col col-sm-12");
    if (input.dataset.alert)
      inputColumn.append(
        Elem.div({ class: "invalid-tooltip" }, null, input.dataset.alert)
      );
    div.append(inputColumn);
    return div;
  }
}

class Row {
  static new(className = "row") {
    const row = d.createElement("div");
    row.className = className;
    return row;
  }
}

class Column {
  static new(child, className = "col-sm mt-2 px-1", style = null, id = null) {
    const div = d.createElement("div");
    if (id) div.id = id;
    div.className = className;
    div.style = style;
    div.append(child);
    return div;
  }
}

class Article {
  static new(title, content, citation) {
    const article = d.createElement("article");
    article.innerHTML = `<h1 class="text-secondary">${title}</h1>
        <blockquote class="blockquote p-0">
          <p class="text-light text-justify", style="font-size:18px">
            “${content}”
          </p>
          <cite class="text-light">
          ${citation}
          </cite>
        </blockquote>`;
    return article;
  }
}

class Subtitle {
  static new(title, className = "text-primary mb-4 subtitle") {
    const subtitle = d.createElement("h5");
    subtitle.append(title);
    subtitle.className = className;
    return subtitle;
  }
}

class ProgressBar {
  static new(value, bgColor) {
    const progressRadius = (251.2 * value) / 100;
    return new DOMParser().parseFromString(
      `
      <svg id="svg" viewbox="0 0 100 100" style="width:70px;">
        <circle cx="50" cy="50" r="45" fill="${bgColor}" />
        <path
          fill="none"
          stroke-linecap="round"
          stroke-width="5"
          stroke="#fff"
          stroke-dasharray="${progressRadius},${251.2 - progressRadius}"
          d="M50 10
            a 40 40 0 0 1 0 80
            a 40 40 0 0 1 0 -80"
        />
        <text x="50" y="50" text-anchor="middle" dy="7" font-size="20" fill="#FFF">
          ${value}%
        </text>
      </svg>;
    `,
      "text/html"
    ).body.firstChild;
  }
}

const removeAll = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const setSession = (json = null) => {
  if (sessionStorage.getItem("auth_token")) {
    SESSION_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
    new Fetch(null, null, SESSION_URL, callback).request();
  } else if (json && json.auth_token) {
    sessionStorage.setItem("auth_token", json.auth_token);
    SESSION_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
    callback(json);
  }
};

const callback = json => {
  if (json.userable_type === "Trainer") {
    new Fetch(null, "GET", TRAINERS_URL + `/${json.userable_id}`, trainer => {
      currentUser = Trainer.create(trainer);
      new Home().render.show();
    }).request();
  } else if (json.userable_type === "User") {
    new Fetch(null, "GET", USERS_URL + `/${json.userable_id}`, user => {
      currentUser = User.create(user);
      new Home().render.show();
    }).request();
  }
};

const loadNavbar = () => {
  if (document.querySelector("nav")) document.querySelector("nav").remove();
  body.prepend(Layout.navbar());
};

d.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  container.append(Layout.footer());
  $("body").tooltip({ selector: "[data-toggle=tooltip]" });
});

function append(element, id, target) {
  if (target.querySelector(`#${id}`)) target.querySelector(`#${id}`).remove();
  target.append(element);
}

const render = (element, target, remove = false) => {
  if (document.querySelector(target)) {
    if (remove) removeAll(document.querySelector(target));
    document.querySelector(target).append(element);
  }
};

const isLoggedIn = () => {
  if (currentUser && sessionStorage.getItem("auth_token")) return true;
  else return false;
};

const isUser = () => currentUser instanceof User;
const isTrainer = () => currentUser instanceof Trainer;

const isOwner = account => currentUser.id === account.id;

