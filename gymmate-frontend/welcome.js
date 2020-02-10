class Welcome {
  static signUpMenu() {
    const menu = document.createElement("div");
    menu.style = "min-height:300px";
    menu.append(
      H1.new("Sign Up As:", "text-primary mb-4 text-center"),
      Button.new(
        "new_trainer_btn",
        "Trainer",
        "btn btn-block btn-dark border-0 shadow rounded-pill my-4",
        new Trainer().renderForm,
        menu
      ),
      Button.new(
        "new_user_btn",
        "Gym Goer",
        "btn btn-block btn-dark border-0 shadow rounded-pill my-4",
        new UserForm().signup,
        menu
      ),
      FormGroup.new(
        Welcome.socialMediaOptions(),
        null,
        "form-group bg-light shadow-sm row border-0 py-5"
      )
    );
    return menu;
  }

  static newUserForm(url) {
    const newUserForm = Form.new("new_user", url, "POST");
    newUserForm.setAttribute("novalidate", true)
    newUserForm.append(
      FormGroup.new(
        Input.new({
          type: "text",
          name: "account[name]",
          placeholder: "Your Name...",
          class: "form-control pl-5 rounded-pill",
          minlength: 3,
          required: "required",
          "data-alert": "Your name requires minimum 3 characters."
        }),
        Icon.new("fas fa-user")
      ),
      FormGroup.new(
        Input.new({
          type: "text",
          name: "account[lastname]",
          placeholder: "Your Lastname...",
          class: "form-control pl-5 rounded-pill",
          minlength: 3,
          required: "required",
          "data-alert": "Your lastname requires minimum 3 characters."
        }),
        Icon.new("fas fa-user")
      ),
      FormGroup.new(
        Input.new({
          type: "text",
          name: "account[username]",
          placeholder: "Your Username...",
          class: "form-control pl-5 rounded-pill",
          minlength: 6,
          required: "required",
          "data-alert": "Your username requires at least 6 characters."
        }),
        Icon.new("fas fa-at")
      ),
      FormGroup.new(
        Input.new({
          type: "email",
          name: "account[email]",
          placeholder: "Your Email...",
          class: "form-control pl-5 rounded-pill",
          required: "required",
          "data-alert": "Please provide a valid email."
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new({
          type: "password",
          name: "account[password]",
          placeholder: "Your Password...",
          class: "form-control pl-5 rounded-pill",
          minlength: 6,
          required: "required",
          "data-alert": "Your password requires minimum 6 characters."
        }),
        Icon.new("fas fa-lock")
      ),
      FormGroup.new(
        Button.new(
          "create_user",
          "Sign Up",
          "btn btn-block btn-primary border-0 shadow rounded-pill",
          null
        )
      )
    );
    return newUserForm;
  }

  static loginForm() {
    const loginForm = Form.new("new_session", SESSIONS_URL, "POST");
    loginForm.append(
      H1.new("Login"),
      FormGroup.new(
        Input.new({
          type: "email",
          name: "account[email]",
          placeholder: "Your email...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new({
          type: "password",
          name: "account[password]",
          placeholder: "Your Password...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-lock")
      ),
      Button.new(
        "create_session",
        "Login",
        "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3",
        null,
        SESSIONS_URL
      ),
      FormGroup.new(
        Welcome.socialMediaOptions(),
        null,
        "form-group bg-light shadow-sm row border-0 py-5"
      )
    );

    return loginForm;
  }

  static socialMediaOptions() {
    const options = `
      <div class="w-100 text-center">
        <h4 class="text-dark">OR LOGIN/SIGNUP WITH</h4>
      </div>
      <div class="d-flex w-100 justify-content-around">
        <a href="#" class="btn-facebook"><i class="fab fa-facebook-square"></i></a>
        <a href="#" class="text-success"><i class="fab fa-instagram"></i></a>
        <a href="#" class="btn-twitter"><i class="fab fa-twitter-square"></i></a>
      </div>`;
    const section = d.createElement("div");
    section.innerHTML = options;
    return section;
  }

  static card(title, className = "card-tooltip") {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardFooter = document.createElement("div");
    card.className = `card ${className} h-100 border-0 p-1 p-sm-5 shadow-sm`;
    cardBody.className =
      "card-body p-0 pt-5 d-flex align-items-center justify-content-center";
    cardBody.cardFooter = "card-footer p-0 text-light";
    cardBody.innerHTML = `
    <h3 class="card-title">
      <a href="#" class="text-light">${title}</a>
    </h3>`;

    card.append(cardBody, cardFooter);
    return card;
  }
  

  static render() {
    return new Promise(res => {
      Render.spinner(main);
      setTimeout(() => {
        res(append(new Grid().headerRow(), "header_row", main));
      }, 10);
    })
      .then(() => {
        append(new Grid().loginRow(), "login_row", main);
      })
      .then(() => {
        append(new Grid().signupRow(), "signup_row", main);
      })
      .then(() => Render.hideSpinner(main));
  }
}

if (sessionStorage.getItem("auth_token")) {
  setSession();
  setTimeout(loadUrl, 50);
} else {
  Welcome.render();
}
