class Render {
  static navbar = () => {
    const navbar = d.createElement("nav");
    navbar.className =
      "navbar shadow sticky-top navbar-expand-lg navbar-dark bg-primary solid ";
    navbar.innerHTML = `<div class="container-fluid">
    <a class="navbar-brand" href="#">
      <h1>Gymmate <i class="fas fa-bolt"></i></h1>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse border-secondary" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto nav-pills nav-fill nav-justify">
        <li class="nav-item">
          <a class="nav-link active" href="#" onclick="removeAll(main);Welcome.render()">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="removeAll(main);main.append(new Grid().loginRow())">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Sign Up</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
      </ul>
    </div>
  </div>`;
    return navbar;
  };

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
        main.append(new Grid().newProgramRow());
      }
    }
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
