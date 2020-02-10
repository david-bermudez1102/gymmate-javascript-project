class User extends Account {
  constructor(
    id,
    name,
    lastname,
    bio,
    dateOfBirth,
    sex,
    username,
    email,
    userId,
    workouts,
    accountView
  ) {
    super(
      id,
      name,
      lastname,
      bio,
      dateOfBirth,
      sex,
      username,
      email,
      accountView
    );
    this._userId = userId;
    this._workouts = workouts;
    this._view = UserView.create(this);
    this._render = RenderUser.create(this);
  }

  get userId() {
    return this._userId;
  }

  get workouts() {
    return this._workouts;
  }

  get view() {
    return this._view;
  }

  get render() {
    return this._render;
  }

  static create(json) {
    const user = new User(
      json.account.id,
      json.account.name,
      json.account.lastname,
      json.account.bio,
      json.account.date_of_birth,
      json.account.sex,
      json.account.username,
      json.account.email,
      json.account.userable_id,
      []
    );

    user._workouts = json.workouts.map(workout =>
      Workout.create(user, workout)
    );
    return user;
  }

  user(target) {
    removeAll(target);
    target.append(Section.new(this.name, null, () => this.show()));
  }

  renderForm(target) {
    removeAll(target);
    const newUser = Welcome.newUserForm(USERS_URL);
    newUser.prepend(H1.new("Sign Up"));
    target.append(newUser);
    newUser.append(
      Link.new(
        { class: "small" },
        () => {
          removeAll(target);
          new Trainer().renderForm(target);
        },
        "Sign up as a Trainer instead."
      )
    );
  }
}

class UserView {
  constructor(user) {
    this._user = user;
  }

  static create(user) {
    return new UserView(user);
  }

  get user() {
    return this._user;
  }

  menu() {
    return Elem.nav(
      {},
      null,
      Elem.div(
        { class: "nav nav-tabs", id: "nav-tab", role: "tablist" },
        null,
        this.workoutsTab(),
        this.picturesTab(),
        this.videosTab()
      )
    );
  }

  profile() {
    return Elem.div(
      {},
      null,
      this.user.accountView.profileHeader(),
      this.menu()
    );
  }

  workoutsTab() {
    return Elem.link(
      {
        class: "nav-item nav-link active",
        id: "nav-workouts-tab",
        "data-toggle": "tab",
        href: "#nav-workouts",
        role: "tab",
        "aria-controls": "nav-workouts",
        "aria-selected": "true"
      },
      null,
      "Workouts"
    );
  }

  picturesTab() {
    return Elem.link(
      {
        class: "nav-item nav-link",
        id: "nav-pictures-tab",
        "data-toggle": "tab",
        href: "#nav-pictures",
        role: "tab",
        "aria-controls": "nav-pictures",
        "aria-selected": "false"
      },
      null,
      "Pictures"
    );
  }

  videosTab() {
    return Elem.link(
      {
        class: "nav-item nav-link",
        id: "nav-video-tab",
        "data-toggle": "tab",
        href: "#nav-video",
        role: "tab",
        "aria-controls": "nav-video",
        "aria-selected": "false"
      },
      null,
      "Video"
    );
  }
}

class RenderUser {
  constructor(user) {
    this._user = user;
  }

  static create(user) {
    return new RenderUser(user);
  }

  get user() {
    return this._user;
  }

  profile(){
    render(this.user.view.profile(), "main", true);
    this.workouts("main", false);
    window.history.pushState(
      { load: `users("${pathName[1]}")` },
      null,
      `/users/${this.userId}`
    );
  }

  workouts(target, remove = true) {
    if(remove) removeAll(d.querySelector(target));
    this.user.workouts.forEach(workout => {
      if (workout.program) render(workout.workout(target), target);
    });
  }
}

class UserForm extends UserView {
  constructor(user) {
    super(user);
  }

  signup(target) {
    removeAll(target);
    const newUser = Welcome.newUserForm(USERS_URL);
    newUser.prepend(H1.new("Sign Up"));
    target.append(newUser);
    newUser.append(
      Link.new(
        { class: "small" },
        () => {
          removeAll(target);
          new Trainer().renderForm(target);
        },
        "Sign up as a Trainer instead."
      )
    );
  }

  editUser() {}
}
