const body = d.querySelector("body");
const main = d.querySelector("main");
const container = d.querySelector(".container-fluid.min-vh-100.p-0");

class Button {
  static new(id, innerText, className, callback = null, url = null) {
    const button = d.createElement("button");
    if (id) button.id = id;
    if (name) button.name = id;
    button.append(innerText);
    button.className = className;
    button.addEventListener("click", function() {
      if (callback && url) {
        callback(url);
      } else if (callback && !url) {
        callback();
      }
    });
    return button;
  }
}

class Input {
  static new(attributes) {
    const input = d.createElement("input");
    Object.keys(attributes).forEach(attribute =>
      input.setAttribute(attribute, attributes[attribute])
    );
    return input;
  }
}

class TextArea {
  static new(name, placeholder, className = "form-control pl-5 rounded-pill") {
    const textArea = d.createElement("textarea");
    textArea.name = name;
    textArea.placeholder = placeholder;
    textArea.className = className;
    return textArea;
  }
}

class Form {
  static new(
    id,
    action,
    method,
    handleSubmit = json => setSession(json),
    target = null
  ) {
    const f = d.createElement("form");
    f.id = id;
    f.action = action;
    f.method = method;
    f.className = "needs-validation";
    if (!target) target = f;
    f.addEventListener(
      "submit",
      function(e) {
        if (!f.method === "GET") f.classList.add("was-validated");
        e.preventDefault();
        e.stopPropagation();
        if (f.checkValidity() === true) {
          const formData = new FormData(this);
          if (method == "GET")
            action = action + `/?${new URLSearchParams(formData).toString()}`;
          if (method !== "GET") {
            new Fetch(formData, method, action, handleSubmit, target).submit();
          } else {
            new Fetch(formData, method, action, handleSubmit, target).request();
          }
          e.target.reset();
        }
      },
      false
    );
    return f;
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
      const btn = Button.new(
        null,
        icon,
        "btn h-100 text-primary text-right border-0 mr-n5 ml-2 rounded-pill"
      );
      div.append(Column.new(btn, "col-auto", "z-index:2;"));
    }
    const inputColumn = Column.new(input, "col col-sm-12");
    if (input.dataset.alert)
      inputColumn.append(Div.new("invalid-tooltip", null, input.dataset.alert));
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

class Icon {
  static new(className, style = null) {
    const i = d.createElement("i");
    i.className = className;
    if (style) i.style = style;
    return i;
  }
}

class Section {
  static new(child, className = null, handleOnClick = null) {
    const section = d.createElement("section");
    section.className = "text-left p-3 p-sm-5 rounded shadow ";
    if (className) section.className += className;
    section.addEventListener("click", e => {
      if (handleOnClick) handleOnClick();
    });
    section.append(child);
    return section;
  }
}

class Article {
  static new(title, content, citation) {
    const article = d.createElement("article");
    article.innerHTML = `<h1 class="text-secondary">${title}</h1>
        <blockquote class="blockquote p-0">
          <p class="text-light text-justify">
            “${content}”
          </p>
          <footer class="blockquote-footer py-0">
            <cite class="text-light">
              ${citation}
            </cite>
          </footer>
        </blockquote>`;
    return article;
  }
}

class H1 {
  static new(title, className = "text-primary mb-4") {
    const header = d.createElement("h1");
    header.append(title);
    header.className = className;
    return header;
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

class Link {
  static new(attributes, handleOnclick, ...append) {
    const link = d.createElement("a");

    Object.keys(attributes).forEach(attribute =>
      link.setAttribute(attribute, attributes[attribute])
    );

    if (!Object.keys(attributes).some(attribute => attribute === "href"))
      link.href = "#";

    link.addEventListener("click", e => {
      if (handleOnclick) handleOnclick();
      e.preventDefault();
    });

    append.forEach(a => link.append(a));
    return link;
  }
}

class List {
  static new(className, callback = null) {
    const ul = d.createElement("ul");
    ul.className = className;
    ul.addEventListener("click", e => {
      if (callback) callback();
    });
    return ul;
  }
}

class Item {
  static new(child, className, callback = null) {
    const li = d.createElement("li");
    li.className = className;
    li.append(child);
    li.addEventListener("click", e => {
      if (callback) callback();
    });
    return li;
  }
}

class Div {
  static new(className = null, id = null, innerHTML = null, callback = null) {
    const div = d.createElement("div");
    if (className) div.className = className;
    if (id) div.id = id;
    if (innerHTML) div.append(innerHTML);
    if (callback)
      div.addEventListener("click", e => {
        if (callback) callback();
        e.preventDefault();
      });
    return div;
  }
}

class Video {
  static new(url, className = "embed-responsive embed-responsive-16by9") {
    const video = d.createElement("video");
    const source = d.createElement("source");
    source.src = `${BASE_URL}${url}`;
    source.className = "embed-responsive-item";
    video.className = className;
    video.controls = true;
    video.append(source);
    return video;
  }
}

class P {
  static new(innerHTML, className = null) {
    const p = d.createElement("p");
    p.append(innerHTML);
    if (className) p.className = className;
    return p;
  }
}

class Span {
  static new(innerHTML = null, className = null, style = null) {
    const span = d.createElement("span");
    if (innerHTML) span.append(innerHTML);
    if (className) span.className = className;
    if (style) span.style = style;
    return span;
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
  console.log(json);
  Render.hideSpinner(main);
  if (json.userable_type === "Trainer") {
    new Fetch(null, "GET", TRAINERS_URL + `/${json.userable_id}`, trainer => {
      Render.hideSpinner(main);
      currentUser = Trainer.create(trainer);
      removeAll(main);
      main.append(new Grid().homeRow());
    }).request();
  } else if (json.userable_type === "User") {
    new Fetch(null, "GET", USERS_URL + `/${json.userable_id}`, user => {
      Render.hideSpinner(main);
      currentUser = User.create(user);
      removeAll(main);
      main.append(new Grid().homeRow());
    }).request();
  }
};

const loadNavbar = () => {
  if (document.querySelector("nav")) document.querySelector("nav").remove();
  body.prepend(Render.navbar());
};

d.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  body.append(Render.footer());
  $("body").tooltip({ selector: "[data-toggle=tooltip]" });
});

function append(element, id, target) {
  if (target.querySelector(`#${id}`)) target.querySelector(`#${id}`).remove();
  target.append(element);
}

const render = (element, target, remove=false) => {
  if(remove) removeAll(target);
  target.append(element)
}

const isLoggedIn = () => {
  if (currentUser && sessionStorage.getItem("auth_token")) return true;
  return false;
};

const isUser = () => currentUser instanceof User;
const isTrainer = () => currentUser instanceof Trainer;

const isOwner = account => currentUser === account;

