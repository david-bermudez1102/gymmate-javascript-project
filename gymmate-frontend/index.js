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
  static new(
    type,
    name,
    placeholder,
    className = "form-control pl-5 rounded-pill",
    value = ""
  ) {
    this.input = d.createElement("input");
    this.input.type = type;
    this.input.name = name;
    this.input.placeholder = placeholder;
    this.input.className = className;
    this.input.value = value;
    return this.input;
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
    data,
    callback = json => setSession(json),
    auth_token = null
  ) {
    const f = d.createElement("form");
    f.id = id;
    f.action = action;
    f.method = method;
    f.addEventListener("submit", function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const newData = {};
      newData[data] = Object.fromEntries(formData);
      if (auth_token) newData["auth_token"] = auth_token;
      new Fetch(newData, "POST", action, callback).submit();
      e.target.reset();
    });
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
    div.append(Column.new(input, "col col-sm-12"));
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
  static new(child, className = "col-sm mt-2 px-1", style = null) {
    const div = d.createElement("div");
    div.className = className;
    div.style = style;
    div.append(child);
    return div;
  }
}

class Icon {
  static new(className) {
    const i = d.createElement("i");
    i.className = className;
    return i;
  }
}

class Section {
  static new(child, className = null) {
    const section = d.createElement("section");
    section.className = "bg-white text-left p-3 p-sm-5 rounded shadow ";
    if (className) section.className += className;
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

class Link {
  static new(innerHTML, className, callback, href = "#") {
    const link = d.createElement("a");
    link.href = href;
    link.append(innerHTML);
    link.className = className;
    link.addEventListener("click", e => {
      callback();
      e.preventDefault();
    });
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
    div.className = className;
    if(innerHTML) div.append(innerHTML)
    div.addEventListener("click", e => {
      if(callback) callback();
      e.preventDefault();
    });
    return div;
  }
}

const removeAll = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const setSession = (json = null) => {
  const callback = json => {
    console.log(json);
    Render.hideSpinner(main);
    if (json.userable_type === "Trainer") {
      new Fetch(null, "GET", TRAINERS_URL + `/${json.userable_id}`, trainer => {
        Render.hideSpinner(main);
        currentUser = new Trainer(
          trainer.account.id,
          trainer.account.name,
          trainer.account.lastname,
          trainer.account.date_of_birth,
          trainer.account.sex,
          trainer.account.username,
          trainer.account.email,
          trainer.account.userable_id,
          []
        );
        trainer.programs.forEach(program => {
          currentUser.programs.push(
            new Program(
              program.id,
              program.title,
              program.description,
              [],
              currentUser,
              program.created_at,
              program.updated_at
            )
          );

          program.exercises.forEach(exercise => {
            currentUser.programs
              .find(program => program.id == exercise.program_id)
              .exercises.push(
                new Exercise(
                  exercise.id,
                  exercise.title,
                  exercise.sets,
                  program
                )
              );
          });
        });

        Render.home();
      }).request();
    } else if (json.userable_type === "User") {
      currentUser = new User(
        json.id,
        json.name,
        json.lastname,
        json.date_of_birth,
        json.sex,
        json.username,
        json.email,
        json.userable_id
      );
    }
    Render.home();
  };
  if (sessionStorage.getItem("auth_token")) {
    DELETE_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
    ACCOUNT_URL = `${ACCOUNTS_URL}/${sessionStorage.getItem("auth_token")}`;
    new Fetch(null, null, ACCOUNT_URL, callback).request();
  } else if (json && json.auth_token) {
    sessionStorage.setItem("auth_token", json.auth_token);
    DELETE_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
    ACCOUNT_URL = `${ACCOUNTS_URL}/${sessionStorage.getItem("auth_token")}`;
    callback(json);
  }
};

const setAccount = json => {};

d.addEventListener("DOMContentLoaded", () => {
  body.prepend(Render.navbar());
  body.append(Render.footer());
});

function append(element, id, target) {
  if (target.querySelector(`#${id}`)) target.querySelector(`#${id}`).remove();
  target.append(element);
}
