const body = d.querySelector("body");
const main = d.querySelector("main");
const container = d.querySelector(".container-fluid.min-vh-100.p-0");

class Button {
  static new(id = null, innerText, className, callback = null, url = null) {
    const button = d.createElement("button");
    if (id) button.id = id;
    if (name) button.name = id;
    button.append(innerText);
    button.className = className;
    button.addEventListener("click", function() {
      if (callback) {
        callback(url);
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
    className = "form-control pl-5 rounded-pill"
  ) {
    this.input = d.createElement("input");
    this.input.type = type;
    this.input.name = name;
    this.input.placeholder = placeholder;
    this.input.className = className;
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
  static new(innerText, className, callback) {
    const link = d.createElement("a");
    link.append(innerText);
    link.className = className;
    link.addEventListener("link", e => {
      e.preventDefault();
      callback;
    });
    return link;
  }
}

const removeAll = node => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};

const setSession = auth_token => {
  if (sessionStorage.getItem("auth_token")) {
    DELETE_URL = `${SESSIONS_URL}/${sessionStorage.getItem("auth_token")}`;
    ACCOUNT_URL = `${ACCOUNTS_URL}/${sessionStorage.getItem("auth_token")}`;
  } else if (auth_token) {
    sessionStorage.setItem("auth_token", auth_token);
  }
};

d.addEventListener("DOMContentLoaded", () => {
  body.prepend(Render.navbar());
  body.append(Render.footer());
});
