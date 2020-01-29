class Render {
  constructor(json) {
    this._json = json;
  }

  get json() {
    return this._json;
  }

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
          <a class="nav-link active" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" onclick="main.append(Render.loginForm())">Login</a>
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

  static newUserForm(url) {
    const newUserForm = Form.new("new_user", url, "POST");
    const name = FormGroup.new(
      Input.new("text", "name", "Your Name..."),
      Icon.new("fas fa-user")
    );
    const lastname = FormGroup.new(
      Input.new("text", "lastname", "Your Lastname..."),
      Icon.new("fas fa-user")
    );
    const username = FormGroup.new(
      Input.new("text", "username", "Your Username..."),
      Icon.new("fas fa-at")
    );
    const email = FormGroup.new(
      Input.new("email", "email", "Your Email..."),
      Icon.new("fas fa-envelope")
    );
    const password = FormGroup.new(
      Input.new("password", "password", "Your Password..."),
      Icon.new("fas fa-lock")
    );
    const button = FormGroup.new(
      Button.new(
        "create_user",
        "Sign Up",
        "btn btn-block btn-primary border-0 shadow rounded-pill",
        null,
        url
      )
    );
    newUserForm.append(name, lastname, username, email, password, button);
    return newUserForm;
  }

  static loginForm() {
    const loginForm = Form.new("new_session", SESSIONS_URL, "POST");
    const email = FormGroup.new(
      Input.new("email", "email", "Your Email..."),
      Icon.new("fas fa-envelope")
    );
    const password = FormGroup.new(
      Input.new("password", "password", "Your Password..."),
      Icon.new("fas fa-lock")
    );
    const button = Button.new(
      "create_session",
      "Login",
      "btn btn-lg btn-block btn-dark border-0 shadow rounded-pill mb-3",
      null,
      SESSIONS_URL
    );
    button.addEventListener("click", () => {
      const formData = () => {
        return {
          account: {
            email: loginForm.email.value,
            password: loginForm.password.value
          }
        };
      };

      const callback = json => {
        console.log(formData());
        setSession(json.auth_token);
        const render = new Render(json);
        render.home();
      };

      const sessionsRequest = new Fetch(
        formData(),
        "POST",
        SESSIONS_URL,
        callback
      );
      sessionsRequest.submit();
    });
    const options = FormGroup.new(
      Welcome.socialMediaOptions(),
      null,
      "form-group bg-light shadow-sm row border-0 py-5"
    );

    loginForm.append(H1.new("Login"),email, password, button, options);
    return loginForm;
  }

  home() {
    if (this.json.message === "success") {
      setSession(this.json.auth_token);
      main.innerHTML = `Welcome ${this.json.name}`;
      main.append(this.logoutBtn());
    }
  }

  logoutBtn() {
    return Button.new("logout_button", "Log Out", null, Account.logout);
  }
}
