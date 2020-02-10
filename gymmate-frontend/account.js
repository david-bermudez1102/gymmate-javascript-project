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

  static logout() {
    const callback = json => {
      sessionStorage.clear();
      window.location.reload();
    };
    new Fetch(null, "DELETE", SESSION_URL, callback).submit();
  }
}

class AccountView {
  constructor(account) {
    this._account = account;
  }

  static create(account) {
    return new AccountView(account);
  }

  get account() {
    return this._account;
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
    const div = Div.new(
      "w-100 mb-4 px-0 pb-2 text-dark text-center",
      `account_${this.account.id}_avatar`,
      null
    );
    div.append(
      H1.new(`${this.account.name} ${this.account.lastname}`, "text-primary")
    );
    div.append(
      Elem.form(
        { action: `${USERS_URL}/${this.account.id}` },
        null,
        this.icon()
      )
    );
    return div;
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

  info() {
    const div = Div.new(null, `account_${this.account.id}_info`, null);
    div.append(P.new(`Username: ${this.account.username}`));
    div.append(P.new(`Bio: ${this.account.bio}`));
    div.append(P.new(`Date of birth: ${this.account.dateOfBirth}`));
    div.append(P.new(`Sex: ${this.account.sex}`));
    return div;
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
          "Are you sure you want to delete this routine?",
          "Yes, Delete",
          "No"
        );
        prompt
          .querySelector("#confirmBtnValue")
          .addEventListener("click", () => content.delete(target));
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
        window.event.stopPropagation();
        render(content.edit(), target, true);
      },
      Elem.icon({ class: "fas fa-pen" })
    );
  }
}

class AccountForm extends AccountView {
  constructor(account) {
    super(account);
  }

  login() {
    return Elem.div(
      { class: "col-md-4 mt-3 px-1" },
      null,
      Elem.section(
        { class: "text-left p-3 p-sm-5 rounded shadow" },
        null,
        Elem.form(
          { class: "new_session", action: SESSIONS_URL, method: "POST" },
          json => setSession(json),
          Elem.h1({}, null, "Login"),
          FormGroup.new(
            Elem.input({
              type: "email",
              name: "account[email]",
              placeholder: "Your email...",
              class: "form-control pl-5 rounded-pill"
            }),
            Icon.new("fas fa-envelope")
          ),
          FormGroup.new(
            Elem.input({
              type: "password",
              name: "account[password]",
              placeholder: "Your Password...",
              class: "form-control pl-5 rounded-pill"
            }),
            Icon.new("fas fa-lock")
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
        )
      )
    );
  }
}

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

  loginRow() {
    render(this.account.view.form.login(), main)
  }
}
