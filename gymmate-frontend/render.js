class Render {
  static navbar = () => {
    const navbar = d.createElement("nav");
    const brand = H1.new(Icon.new("fas fa-bolt"), null)
    brand.prepend("Gymmate ")
    navbar.className =
      "navbar shadow sticky-top navbar-expand-lg navbar-dark bg-primary solid ";
    const container = Div.new("container-fluid", null);

    container.append(
      Link.new(
        brand,
        "navbar-brand"
      ),
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

  static navbarOptions() {
    const navbarOptions = List.new(
      "navbar-nav ml-auto nav-pills nav-fill nav-justify"
    );
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
      removeAll(main);
      Welcome.render();
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
    return new DOMParser().parseFromString(`
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" href="#">Something else here</a>
    </div>`, "text/html").body.firstChild;
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
    if (currentUser && sessionStorage.getItem("auth_token")) {
      main.innerHTML = `Welcome ${currentUser.name}`;
      main.append(this.logoutBtn());
      if (currentUser instanceof Trainer) {
        main.append(this.allProgramsLink());
        main.append(new Grid().newProgramRow());
      }
    }
  }

  static logoutBtn() {
    return Button.new("logout_button", "Log Out", null, Account.logout);
  }

  static allProgramsLink() {
    return Link.new(
      "View My Routines",
      null,
      () => {
        currentUser.allPrograms();
      },
      "#"
    );
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
