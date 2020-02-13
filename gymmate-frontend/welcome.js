class Welcome {
  static signUpMenu() {
    const btnClass = "btn btn-block btn-dark border-0 shadow rounded-pill my-4";
    const menu = document.createElement("div");
    menu.id = "sign_up_menu";
    menu.style = "min-height:300px";
    menu.append(
      Elem.h1({ class: "text-primary mb-4 text-center" }, null, "Sign Up As:"),
      Elem.button(
        { id: "new_trainer_btn", class: btnClass },
        () => render(new Trainer().view.form.signup(), "#sign_up_menu", true),
        "Trainer"
      ),
      Elem.button(
        { id: "new_user_btn", class: btnClass },
        () => render(new User().view.form.signup(), "#sign_up_menu", true),
        "Gym Goer"
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
    newUserForm.setAttribute("novalidate", true);
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

  static loginRow() {
    return Elem.div(
      { id: "login_row", class: "row" },
      null,
      Elem.div(
        { class: "col-md-4 mt-3 px-1" },
        null,
        Elem.section(
          { class: "text-left p-3 p-sm-5 rounded shadow" },
          null,
          new Account().accountView.form.login()
        )
      ),
      Elem.div(
        { class: "col-md mt-4 mt-md-3 pl-1 pl-md-4 pr-1" },
        null,
        this.card(
          "Login to retrieve your current workouts!",
          "card-tooltip banner login-banner"
        )
      )
    );
  }

  static signupRow() {
    return Elem.div(
      { id: "signup_row", class: "row" },
      null,
      Elem.div(
        { class: "col-md mt-4 mt-md-3 pr-1 pr-md-4 pl-1" },
        null,
        Welcome.card(
          "It all starts here. Sign Up now",
          "inverse-card-tooltip banner signup-banner"
        )
      ),
      Elem.div(
        { class: "col-md-4 mt-3 px-1" },
        null,
        Elem.section(
          { class: "text-left p-3 p-sm-5 rounded shadow" },
          null,
          this.signUpMenu()
        )
      )
    );
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
      Layout.spinner(main);
      setTimeout(() => {
        res(append(new Grid().headerRow(), "header_row", main));
      }, 10);
    })
      .then(() => render(this.loginRow(), "main"))
      .then(() => {
        render(this.signupRow(), "main");
      })
      .then(() => Layout.hideSpinner(main));
  }
}

if (sessionStorage.getItem("auth_token")) {
  setSession();
  setTimeout(loadUrl, 50);
} else {
  Welcome.render();
}
