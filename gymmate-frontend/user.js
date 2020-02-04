class User extends Account {
  constructor(id, name, lastname, bio, dateOfBirth, sex, username, email, userId) {
    super(id, name, lastname, bio, dateOfBirth, sex, username, email);
    this._userId = userId;
  }

  get userId() {
    return this._userId;
  }

  static create(json) {
    return new User(
      json.account.id,
      json.account.name,
      json.account.lastname,
      json.account.bio,
      json.account.date_of_birth,
      json.account.sex,
      json.account.username,
      json.account.email,
      json.account.userable_id
    );
  }

  user(target) {
    removeAll(target);
    target.append(Section.new(this.name, null, () => this.show()));
  }

  show() {
    removeAll(main);
    main.append(new Grid().showProfileRow(this));
    main.append(this.menu());
    window.history.pushState(
      { load: `users("${pathName[1]}")` },
      null,
      `/users/${this.userId}`
    );
  }

  renderForm(target) {
    removeAll(target);
    const newUser = Welcome.newUserForm(USERS_URL);
    newUser.prepend(H1.new("Sign Up"));
    target.append(newUser);
    newUser.append(
      Link.new("Sign up as a Trainer instead.", "small", () => {
        removeAll(target);
        new Trainer().renderForm(target);
      })
    );
  }

  menu() {
    return new DOMParser().parseFromString(
      `<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Workouts</a>
    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Pictures</a>
    <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Videos</a>
  </div>
</nav>
`,
      "text/html"
    ).body.firstChild;
  }
}
