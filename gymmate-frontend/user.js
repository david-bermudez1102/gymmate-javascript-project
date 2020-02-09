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
    workouts
  ) {
    super(id, name, lastname, bio, dateOfBirth, sex, username, email);
    this._userId = userId;
    this._workouts = workouts;
  }

  get userId() {
    return this._userId;
  }

  get workouts() {
    return this._workouts;
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

  show() {
    removeAll(main);
    main.append(new Grid().showProfileRow(this));
    main.append(this.menu());
    this.allWorkouts(main);
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

  allWorkouts(target) {
    return this.workouts.map(workout => {
      if (workout.program) return new Grid().workoutRow(workout, target);
    });
  }


  menu() {
    return Elem.html(`
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <a
            class="nav-item nav-link active"
            id="nav-home-tab"
            data-toggle="tab"
            href="#nav-home"
            role="tab"
            aria-controls="nav-home"
            aria-selected="true"
          >
            Workouts
          </a>
          <a
            class="nav-item nav-link"
            id="nav-profile-tab"
            data-toggle="tab"
            href="#nav-profile"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="false"
          >
            Pictures
          </a>
          <a
            class="nav-item nav-link"
            id="nav-contact-tab"
            data-toggle="tab"
            href="#nav-contact"
            role="tab"
            aria-controls="nav-contact"
            aria-selected="false"
          >
            Videos
          </a>
        </div>
      </nav>
    `);
  }
}
