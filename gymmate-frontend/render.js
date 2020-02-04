class Render {
  static navbar = () => {
    const navbar = d.createElement("nav");
    const brand = H1.new(Icon.new("fas fa-bolt"), null);
    brand.prepend("Gymmate ");
    navbar.className = navbarClass;
    const container = Div.new("container-fluid", null);

    container.append(
      Link.new(brand, "navbar-brand"),
      this.navbarToggler(),
      Div.new(
        "collapse navbar-collapse border-secondary",
        "navbarSupportedContent",
        this.navbarOptions()
      )
    );
    navbar.append(container);
    return navbar;
  };

  static searchBar() {
    const handleSubmit = json => {
      this.hideSpinner(main);
      new Promise(res => res(main.append(new Grid().homeRow()))).then(() => this.listResults(json));
    };

    const form = Form.new(
      "new_search",
      SEARCH_URL,
      "GET",
      handleSubmit,
      sessionStorage.getItem("auth_token")
    );
    form.className = "mx-auto";

    const div = Div.new("input-group");
    const span = d.createElement("span");
    span.className = "input-group-append";
    span.append(
      Div.new(
        "input-group-text bg-white rounded-top-right-50 rounded-bottom-right-50 border-0",
        "",
        Icon.new("fa fa-search")
      )
    );
    div.append(
      Input.new(
        "search",
        "query",
        "Search routines, trainers, etc...",
        "form-control rounded-top-left-50 rounded-bottom-left-50 border-0"
      ),
      span
    );
    form.append(div);
    return form;
  }

  static listResults(json) {
    if (d.querySelector("#main_container")) {
      const mainContainer = d.querySelector("#main_container");
      json.trainers.forEach(trainer =>
        Trainer.create(trainer).trainer(mainContainer)
      );
    }
  }

  static navbarOptions() {
    const navbarOptions = List.new(
      "navbar-nav ml-auto nav-pills nav-fill nav-justify"
    );

    if (sessionStorage.getItem("auth_token"))
      navbarOptions.append(Item.new(this.searchBar()));

    navbarOptions.append(
      Item.new(this.homeLink()),
      Item.new(this.loginLink()),
      Item.new(this.signUpLink()),
      this.accountLink()
    );
    return navbarOptions;
  }

  static homeLink() {
    return Link.new(`Home`, "nav-link active", () => {
      if (currentUser && sessionStorage.getItem("auth_token")) {
        main.append(new Grid().homeRow());
      } else {
        Welcome.render();
      }
    });
  }

  static navbarToggler() {
    return new DOMParser().parseFromString(
      `
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    `,
      "text/html"
    ).body.firstChild;
  }

  static loginLink() {
    return Link.new(`Login`, "nav-link", () => {
      removeAll(main);
      append(new Grid().loginRow(), null, main);
    });
  }

  static signUpLink() {
    return Link.new(`Sign Up`, "nav-link", () => {
      removeAll(main);
      append(new Grid().loginRow(), null, main);
    });
  }

  static accountLink() {
    const link = Item.new(
      new DOMParser().parseFromString(
        `
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Account
      </a>
      `,
        "text/html"
      ).body.firstChild
    );
    link.append(this.accountLinkOptions());
    return link;
  }

  static accountLinkOptions() {
    return new DOMParser().parseFromString(
      `
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#" onclick="Account.logout()">Logout</a>
    </div>`,
      "text/html"
    ).body.firstChild;
  }

  static footer = () => {
    const footer = d.createElement("footer");
    footer.className = "bg-dark text-muted";
    footer.innerHTML = `
  <div class="container-fluid">
    <p class="float-sm-right">
      <a href="#">Back to top</a>
    </p>
    <p>Album example is &copy; Bootstrap, but please download and customize it for yourself!</p>
    <p class="float-sm-right lead">
      <a href="#" class="footer-link text-light"><i class="fab fa-facebook-square"></i></a>
      <a href="#" class="footer-link text-light"><i class="fab fa-twitter-square"></i></a>
      <a href="#" class="footer-link text-light"><i class="fab fa-instagram"></i></a>
    </p>
    <p>New to Bootstrap? <a href="../../">Visit the homepage</a> or read our <a href="../../getting-started/">getting started guide</a>.</p>
  </div>
`;
    return footer;
  };

  static home() {
    removeAll(main);
    const div = d.createElement("div");
    if (currentUser && sessionStorage.getItem("auth_token")) {
      if (currentUser instanceof Trainer) {
        div.append(new Grid().newProgramRow());
      }
    }
    window.history.pushState({ load: "Render.home()" }, null, "/");
    return div;
  }

  static menu() {
    const menu = Div.new(
      "nav text-dark flex-column nav-pills w-50 dark",
      "v-pills-tab"
    );
    menu.setAttribute("role", "tablist");
    menu.setAttribute("aria-orientation", "vertical");
    menu.append(
      `Welcome ${currentUser.name}`,
      Render.mainMenuHomeLink(),
      Render.mainMenuMessagesLink(),
      Render.mainMenuRoutinesLink(),
      Render.mainMenuProfileLink()
    );
    return menu;
  }

  static mainMenuHomeLink() {
    const link = Link.new("Home", "nav-link active", () => {
      if (d.querySelector("#main_container")) {
        const mainContainer = d.querySelector("#main_container");
        removeAll(mainContainer);
        mainContainer.append(Render.home());
      }
    });
    link.setAttribute("data-toggle", "pill");
    return link;
  }

  static mainMenuProfileLink() {
    const link = Link.new("Profile", "nav-link", () => {
      if (d.querySelector("#main_container")) {
        const mainContainer = d.querySelector("#main_container");
        removeAll(mainContainer);
        mainContainer.append(Render.home());
      }
    });
    link.setAttribute("data-toggle", "pill");
    return link;
  }

  static mainMenuMessagesLink() {
    const link = Link.new("Messages", "nav-link");
    link.setAttribute("data-toggle", "pill");
    return link;
  }

  static mainMenuRoutinesLink() {
    const link = Link.new("My Routines", "nav-link", () => {
      if (d.querySelector("#main_container")) {
        const mainContainer = d.querySelector("#main_container");
        removeAll(mainContainer);
        currentUser.allPrograms(mainContainer);
      }
    });
    link.setAttribute("data-toggle", "pill");
    return link;
  }

  static logoutBtn() {
    return Button.new("logout_button", "Log Out", null, Account.logout);
  }

  static spinner(node, where = container) {
    document.documentElement.scrollTop = 0;
    const spinner = d.createElement("div");
    spinner.setAttribute("id", "spinner");
    spinner.style.visibility = "visible";
    where.prepend(spinner);
    node.style.display = "none";
  }

  static hideSpinner(node) {
    const spinner = document.getElementById("spinner");
    spinner.style.visibility = "hidden";
    node.style.display = "";
    spinner.remove();
  }
}
