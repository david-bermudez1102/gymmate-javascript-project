class Account {
  constructor(id, name, lastname, bio, dateOfBirth, sex, username, email) {
    this._id = id;
    this._name = name;
    this._lastname = lastname;
    this._bio = bio;
    this._dateOfBirth = dateOfBirth;
    this._sex = sex;
    this._username = username;
    this._email = email;
    this._accountView = AccountView.create(this);
    this._render = AccountRender.create(this);
    this._controller = AccountController.create(this);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get lastname() {
    return this._lastname;
  }

  get bio() {
    return this._bio;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  get sex() {
    return this._sex;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get accountView() {
    return this._accountView;
  }

  get render() {
    return this._render;
  }

  get controller() {
    return this._controller;
  }
}

//================================================================//

class AccountView {
  constructor(account) {
    this._account = account;
    this._form = AccountForm.create(this);
  }

  static create(account) {
    return new AccountView(account);
  }

  get account() {
    return this._account;
  }

  get form() {
    return this._form;
  }

  profileHeader() {
    return Elem.div(
      { class: "row" },
      null,
      Elem.div(
        { class: "col-md-3 d-flex justify-content-left" },
        null,
        this.profilePic()
      ),
      Elem.div(
        { class: "col-md d-flex justify-content-left" },
        null,
        this.info()
      )
    );
  }

  profilePic() {
    return Elem.div(
      {
        class: "w-100 mb-4 px-0 pb-2 text-dark text-center",
        id: `account_${this.account.id}_avatar`
      },
      null,
      Elem.h1(
        { class: "text-primary" },
        null,
        `${this.account.name} ${this.account.lastname}`
      ),
      Elem.form(
        { action: `${USERS_URL}/${this.account.id}` },
        null,
        this.icon()
      )
    );
  }

  icon() {
    const file = Elem.input({
      type: "file",
      class: "d-none",
      name: "account[profile_picture]"
    });

    const label = Elem.label(
      {},
      null,
      file,
      Elem.icon({ class: "fas fa-user-circle", style: "font-size:15vw" })
    );

    file.addEventListener("change", () => {
      Picture.handleFiles(file.files, label, file);
    });

    return label;
  }

  username() {
    return Elem.p(
      { class: "display-4 text-primary", style:"font-size:32px" },
      null,
      Elem.icon({
        class: "fas fa-user"
      }),
      ` @${this.account.username}`
    );
  }

  bio() {
    return Elem.h4(
      {},
      null,
      Elem.span({ class: "text-primary bold" }, null, "Bio:"),
      ` ${this.account.bio || "No information yet."}`
    );
  }

  dateOfBirth() {
    return Elem.h4(
      {},
      null,
      Elem.span({ class: "text-primary bold" }, null, "Date of birth:"),
      ` ${this.account.dateOfBirth || "No information yet."}`
    );
  }

  sex() {
    return Elem.h4(
      {},
      null,
      Elem.span({ class: "text-primary bold" }, null, "Sex:"),
      ` ${this.account.sex || "No information yet."}`
    );
  }

  info() {
    return Elem.div(
      { id: `account_${this.account.id}_info` },
      null,
      this.username(),
      this.bio(),
      this.dateOfBirth(),
      this.sex()
    );
  }

  options(content, target) {
    const optionsClassName =
      "col-lg-2 d-flex align-items-center order-1 order-sm-1 order-md-1 order-lg-2 justify-content-between";
    return Elem.div(
      { class: optionsClassName },
      null,
      this.editBtn(content, target),
      this.deleteBtn(content, target)
    );
  }

  deleteBtn(content, target) {
    return Elem.link(
      {
        class: "text-light",
        "data-toggle": "tooltip",
        "data-placement": "top",
        title: "Delete Routine"
      },
      () => {
        window.event.stopPropagation();
        const prompt = Elem.prompt(
          `Delete "${content.title}"`,
          "Are you sure you want to delete this content?",
          "Yes, Delete",
          "No"
        );
        prompt
          .querySelector("#confirmBtnValue")
          .addEventListener("click", () => content.controller.delete(target));
        append(prompt, "myModal", main);
        $("#myModal").modal("toggle");
      },
      Elem.icon({ class: "fas fa-trash" })
    );
  }

  editBtn(content, target) {
    return Elem.link(
      {
        class: "text-light",
        "data-toggle": "tooltip",
        "data-placement": "top",
        title: "Edit This Routine"
      },
      () => {
        content.render.editRow(target);
        window.event.stopPropagation();
      },
      Elem.icon({ class: "fas fa-pen" })
    );
  }
}

//================================================================//

class AccountForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new AccountForm(view);
  }

  get view() {
    return this._view;
  }

  login() {
    return Elem.form(
      {
        class: "needs-validation",
        id: "new_session",
        action: SESSIONS_URL,
        method: "POST"
      },
      json => setSession(json),
      Elem.h1({ class: "text-primary mb-4" }, null, "Login"),
      FormGroup.new(
        Elem.input({
          type: "email",
          name: "account[email]",
          placeholder: "Your email...",
          class: "form-control pl-5 rounded-pill"
        }),
        Elem.icon({ class: "fas fa-envelope" })
      ),
      FormGroup.new(
        Elem.input({
          type: "password",
          name: "account[password]",
          placeholder: "Your Password...",
          class: "form-control pl-5 rounded-pill"
        }),
        Elem.icon({ class: "fas fa-lock" })
      ),
      Elem.input(
        {
          class:
            "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3",
          type: "submit",
          id: "create_session",
          value: "Login"
        },
        () => window.event.stopPropagation()
      ),
      FormGroup.new(
        Welcome.socialMediaOptions(),
        null,
        "form-group bg-light shadow-sm row border-0 py-5"
      )
    );
  }

  signup() {
    return Elem.form(
      { id: "new_user", method: "POST", novalidate: "novalidate" },
      json => setSession(json),
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "account[name]",
          placeholder: "Your Name...",
          class: "form-control pl-5 rounded-pill",
          minlength: 3,
          required: "required",
          "data-alert": "Your name requires minimum 3 characters."
        }),
        Elem.icon({class:"fas fa-user"})
      ),
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "account[lastname]",
          placeholder: "Your Lastname...",
          class: "form-control pl-5 rounded-pill",
          minlength: 3,
          required: "required",
          "data-alert": "Your lastname requires minimum 3 characters."
        }),
        Elem.icon({class:"fas fa-user"})
      ),
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "account[username]",
          placeholder: "Your Username...",
          class: "form-control pl-5 rounded-pill",
          minlength: 6,
          required: "required",
          "data-alert": "Your username requires at least 6 characters."
        }),
        Elem.icon({class:"fas fa-at"})
      ),
      FormGroup.new(
        Elem.input({
          type: "email",
          name: "account[email]",
          placeholder: "Your Email...",
          class: "form-control pl-5 rounded-pill",
          required: "required",
          "data-alert": "Please provide a valid email."
        }),
        Elem.icon({class:"fas fa-envelope"})
      ),
      FormGroup.new(
        Elem.input({
          type: "password",
          name: "account[password]",
          placeholder: "Your Password...",
          class: "form-control pl-5 rounded-pill",
          minlength: 6,
          required: "required",
          "data-alert": "Your password requires minimum 6 characters."
        }),
        Elem.icon({class:"fas fa-lock"})
      ),
      FormGroup.new(
        Elem.input(
          {
            type: "submit",
            id: "create_user",
            value: "Sign Up",
            class: "btn btn-block btn-primary border-0 shadow rounded-pill"
          }
        )
      )
    );
  }
}

//================================================================//

class AccountRender {
  constructor(account) {
    this._account = account;
  }

  static create(account) {
    return new AccountRender(account);
  }

  get account() {
    return this._account;
  }
}

class AccountController {
  constructor(account) {
    this._account = account;
  }

  static create(account) {
    return new AccountController(account);
  }

  logout() {
    const callback = json => {
      sessionStorage.clear();
      window.location.reload();
    };
    new Fetch(null, "DELETE", SESSION_URL, callback).submit();
  }
}
