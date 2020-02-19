class Layout {
  static navbar() {
    const brand = Elem.h1({}, null, "Gymmate ", Elem.icon({class:"fas fa-bolt"}));

    return Elem.nav(
      { class: navbarClass },
      null,
      Elem.div(
        { class: "container-fluid" },
        null,
        Elem.link({ class: "navbar-brand" }, null, brand),
        this.navbarToggler(),
        Elem.div(
          {
            class: "collapse navbar-collapse border-secondary",
            id: "navbarSupportedContent"
          },
          null,
          this.navbarOptions()
        )
      )
    );
  }

  static navbarOptions() {
    return Elem.ul(
      {
        class: "navbar-nav ml-auto nav-pills nav-fill nav-justify"
      },
      null,
      sessionStorage.getItem("auth_token")
        ? Elem.li({ class: "px-4" }, null, new Search().view.searchBar())
        : "",
      Elem.li({}, null, this.homeLink()),
      isLoggedIn() ? "" : Elem.li({}, null, this.loginLink()),
      isLoggedIn() ? "" : Elem.li({}, null, this.signUpLink()),
      isLoggedIn() ? this.accountLink() : ""
    );
  }

  static homeLink() {
    return Elem.link(
      { class: "nav-link active" },
      () => {
        if (isLoggedIn()) {
          new Home().controller.show();
        } else {
          Welcome.render();
        }
      },
      `Home`
    );
  }

  static navbarToggler() {
    return Elem.button(
      {
        class: "navbar-toggler",
        type: "button",
        "data-toggle": "collapse",
        "data-target": "#navbarSupportedContent",
        "aria-controls": "navbarSupportedContent",
        "aria-expanded": "false",
        "aria-label": "Toggle navigation"
      },
      null,
      Elem.span({ class: "navbar-toggler-icon" })
    );
  }

  static loginLink() {
    return Elem.link(
      { class: "nav-link" },
      () => {
        if (!isLoggedIn()) {
          render(Welcome.loginRow(), "main", true);
        }
      },
      `Login`
    );
  }

  static signUpLink() {
    return Elem.link(
      { class: "nav-link" },
      () => render(Welcome.signupRow(), "main", true)
      ,
      `Sign Up`
    );
  }

  static accountLink() {
    return Elem.li({}, null,
      Elem.link(
        {
          class: "nav-link dropdown-toggle",
          id: "navbarDropdown",
          role: "button",
          "data-toggle": "dropdown",
          "aria-haspopup": "true",
          "aria-expanded": "false"
        },
        null,
        "Account",
        this.accountLinkOptions()
      )
    );
  }

  static accountLinkOptions() {
    return Elem.div(
      {
        class: "dropdown-menu dropdown-menu-right",
        "aria-labelledby": "navbarDropdown"
      },
      null,
      Elem.link({ class: "dropdown-item" }, null, "Edit Account"),
      Elem.div({ class: "dropdown-divider" }),
      Elem.link({ class: "dropdown-item" }, () => new Account().controller.logout(), "Logout")
    );
  }

  static footer() {
    const footer = d.createElement("footer");
    footer.className = "bg-dark text-muted";
    footer.innerHTML = `
      <div class="container-fluid">
        <p class="float-sm-right">
          <a href="#">Back to top</a>
        </p>
        <p>
          Gymmate &copy; ${new Date().getFullYear()} 
        </p>
        <p class="float-sm-right lead">
          <a href="#" class="footer-link text-light">
            <i class="fab fa-facebook-square"></i>
          </a>
          <a href="#" class="footer-link text-light">
            <i class="fab fa-twitter-square"></i>
          </a>
          <a href="#" class="footer-link text-light">
            <i class="fab fa-instagram"></i>
          </a>
        </p>
        <p>
          New to Gymmate? <a href="../../">Visit the homepage</a> or read our
          <a href="../../getting-started/">Read me</a>.
        </p>
      </div>
    `;

    return footer;
  }

  static mutedContainer(){
    return Elem.div({
      class:
        "d-flex position-absolute w-100 h-100 align-items-center justify-content-center",
      style: "top:0; left:0; background: rgba(0,0,0,.5);"
    });
  }

  static counter(start) {
    let count = start;

    const countDownDiv = this.mutedContainer()

    const counterDiv = Elem.div({
      class:
        "d-flex rounded-circle display-4 bg-dark justify-content-center align-items-center",
      style: "width:80px; height:80px;"
    });

    const counter = setInterval(() => {
      if (count >= 0) {
        counterDiv.innerHTML = count;
        count--;
      } else {
        countDownDiv.parentNode.querySelector("video").play();
        countDownDiv.remove();
        clearInterval(counter);
      }
    }, 1000);

    d.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        countDownDiv.remove();
        clearInterval(counter);
      }
    });

    countDownDiv.append(counterDiv);
    return countDownDiv;
  }

  static spinner(node, target = container) {
    const spinner = Elem.div({ id: "spinner", style: "visibility:visible" });
    target.prepend(spinner);
    node.style.display = "none";
  }

  static hideSpinner(node) {
    const spinner = document.getElementById("spinner");
    spinner.style.visibility = "hidden";
    node.style.display = "";
    spinner.remove();
  }

  static error(json, target) {
    console.log(json);
    const errorsList = Elem.ul({}, null);
    json.errors.forEach(error => errorsList.append(Elem.li({}, null,error)));
    if (d.querySelector(".alert")) d.querySelector(".alert").remove();
    target.prepend(Elem.div({class:"alert alert-danger"}, null, errorsList));
    target
      .querySelectorAll("input")
      .forEach(input => (input.className += " is-invalid"));
  }

  static modal() {
    main.append(
      Elem.div(
        { class: "modal d-flex", role: "dialog" },
        null,
        Elem.div(
          { class: "modal-dialog" },
          null,
          Elem.div(
            { class: "modal-content" },
            null,
            Elem.div(
              { class: "modal-header" },
              null,
              Elem.div({ class: "modal-title display-4" }, null, "Hello")
            )
          )
        )
      )
    );
  }

  static noContent(content){
    return Elem.div(
      {
        class:
          "bg-light text-dark h-100 d-flex align-items-center justify-content-center"
      },
      null,
      Elem.p({class:"display-4"}, null, `No ${content} found`)
    );
  }
}
