class Render {
  static navbar() {
    const brand = Elem.h1({}, null, "Gymmate ", Icon.new("fas fa-bolt"));

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
        ? Elem.li({}, null, this.searchBar())
        : "",
      Elem.li({}, null, this.homeLink()),
      Elem.li({}, null, this.loginLink()),
      Elem.li({}, null, this.signUpLink()),
      this.accountLink()
    );
  }

  static homeLink() {
    return Link.new(
      { class: "nav-link active" },
      () => {
        if (isLoggedIn()) {
          removeAll(main);
          main.append(new Grid().homeRow());
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

  static searchBar() {
    const handleSubmit = json => {
      this.hideSpinner(main);
      if (!main.querySelector("#home_row")) {
        new Promise(res =>
          res(render(new Grid().homeRow(), "main", true))
        ).then(() => this.listResults(json));
      } else {
        this.listResults(json);
      }
    };

    return Elem.form(
      { class: "mx-auto", id: "new_search", action: SEARCH_URL, method: "GET" },
      handleSubmit,
      Elem.div(
        { class: "input-group" },
        null,
        Input.new({
          type: "search",
          name: "query",
          placeholder: "Search routines, trainers, etc...",
          class:
            "form-control rounded-top-left-50 rounded-bottom-left-50 border-0"
        }),
        Elem.span(
          { class: "input-group-append" },
          null,
          Elem.div(
            {
              class:
                "input-group-text bg-white rounded-top-right-50 rounded-bottom-right-50 border-0"
            },
            null,
            Elem.icon({ class: "fa fa-search" })
          )
        )
      )
    );
  }

  static loginLink() {
    return Elem.link(
      { class: "nav-link" },
      () => {
        if (!isLoggedIn()) {
          removeAll(main);
          append(new Grid().loginRow(), null, main);
        }
      },
      `Login`
    );
  }

  static signUpLink() {
    return Link.new(
      { class: "nav-link" },
      () => {
        removeAll(main);
        append(new Grid().loginRow(), null, main);
      },
      `Sign Up`
    );
  }

  static accountLink() {
    return Item.new(
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
      Elem.link(
        { class: "dropdown-item" },
        () => Account.logout(),
        "Edit Account"
      )
    );
  }

  static listResults(json) {
    if (d.querySelector("#main_container")) {
      const mainContainer = d.querySelector("#main_container");
      removeAll(mainContainer);

      json.trainers.forEach(trainer =>
        Trainer.create(trainer).trainer(mainContainer)
      );

      json.users.forEach(user => User.create(user).user(mainContainer));

      json.programs.forEach(program =>
        new Fetch(
          null,
          "GET",
          `${TRAINERS_URL}/${program.trainer_id}`,
          json => {
            this.hideSpinner(main);
            const trainer = Trainer.create(json);
            render(
              new Grid().programRow(
                Program.create(trainer, program),
                "#main_container"
              ),
              "#main_container"
            );
          }
        ).request()
      );
    }
  }

  static footer = () => {
    const footer = d.createElement("footer");
    footer.className = "bg-dark text-muted";
    footer.innerHTML = `
      <div class="container-fluid">
        <p class="float-sm-right">
          <a href="#">Back to top</a>
        </p>
        <p>
          Gymmate &copy; Bootstrap, but please download and customize it for
          yourself!
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
          New to Bootstrap? <a href="../../">Visit the homepage</a> or read our{" "}
          <a href="../../getting-started/">getting started guide</a>.
        </p>
      </div>
    `;

    return footer;
  };

  static home() {
    const div = d.createElement("div");
    if (isLoggedIn()) {
      if (currentUser instanceof Trainer) {
        div.append(new Grid().newProgramRow());
      }
    }
    window.history.pushState({ load: "Render.home()" }, null, "/");
    return div;
  }

  static menu() {
    return Elem.div(
      {
        class:
          "nav flex-column w-100 flex-wrap nav-pills shadow p-4 rounded text-light",
        role: "tablist",
        "aria-orientation": "vertical",
        id: "v-pills-tab"
      },
      null,
      currentUser.profilePic(),
      this.mainMenuHomeLink(),
      this.mainMenuMessagesLink(),
      isTrainer() ? this.mainMenuRoutinesLink() : this.mainMenuWorkoutsLink(),
      this.mainMenuProfileLink()
    );
  }

  static mainMenuHomeLink() {
    return Elem.link(
      { class: "nav-link active", "data-toggle": "pill" },
      () => render(new Grid().homeRow(), "main", true),
      "Home"
    );
  }

  static mainMenuProfileLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      () => render(currentUser.show(), "#main_container", true),
      "Profile"
    );
  }

  static mainMenuMessagesLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      null,
      "Messages"
    );
  }

  static mainMenuRoutinesLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      () => {
        removeAll(d.querySelector("#main_container"));
        currentUser
          .allPrograms("#main_container")
          .forEach(program => render(program, "#main_container"));
      },
      "My Routines"
    );
  }

  static mainMenuWorkoutsLink() {
    return Elem.link(
      {
        class: "nav-link",
        "data-toggle": "pill",
        id: "main_menu_workouts_link"
      },
      () => this.allWorkouts(currentUser, "#main_container"),
      "My Workouts"
    );
  }

  static allWorkouts(user, target) {
    removeAll(d.querySelector(target));
    user.workouts.forEach(workout => {
      if (workout.program) render(workout.workout(target), target);
    });
  }

  static counter(start) {
    let count = start;

    const countDownDiv = Elem.div({
      class:
        "d-flex position-absolute w-100 h-100 align-items-center justify-content-center",
      style: "top:0; left:0; background: rgba(0,0,0,.5);"
    });

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
    Render.hideSpinner(main);
    const errorsList = List.new();
    json.errors.forEach(error => errorsList.append(Item.new(error)));
    if (d.querySelector(".alert")) d.querySelector(".alert").remove();
    target.prepend(Div.new("alert alert-danger", undefined, errorsList));
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
}
