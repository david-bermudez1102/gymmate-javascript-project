class Grid {
  constructor() {
    this._row = Row.new();
  }

  get row() {
    return this._row;
  }

  headerRow() {
    this.row.append(
      Column.new(
        Section.new(
          Article.new(
            "Create Routines",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-1"
        )
      ),
      Column.new(
        Section.new(
          Article.new(
            "Article",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-2"
        )
      ),
      Column.new(
        Section.new(
          Article.new(
            "Article",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-3"
        )
      )
    );
    this.row.id = "header_row";
    return this.row;
  }

  loginRow() {
    this.row.append(
      Column.new(Section.new(Welcome.loginForm()), "col-md-4 mt-3 px-1"),
      Column.new(
        Welcome.card(
          "Login to retrieve your current workouts!",
          "card-tooltip banner login-banner"
        ),
        "col-md mt-4 mt-md-3 pl-1 pl-md-4 pr-1"
      )
    );
    this.row.id = "login_row";
    return this.row;
  }

  signupRow() {
    this.row.append(
      Column.new(
        Welcome.card(
          "It all starts here. Sign Up now",
          "inverse-card-tooltip banner signup-banner"
        ),
        "col-md mt-4 mt-md-3 pr-1 pr-md-4 pl-1"
      ),
      Column.new(Section.new(Welcome.signUpMenu()), "col-md-4 mt-3 px-1")
    );
    this.row.id = "signup_row";
    return this.row;
  }

  homeRow() {
    loadNavbar();
    this.row.append(
      Column.new(Render.menu(), "col-sm-6 col-md-5 col-lg-3 d-flex"),
      Column.new(Render.home(), "col-sm-6 col-md px-sm-1", "", "main_container")
    );
    this.row.id = "home_row";
    return this.row;
  }

  showProfileRow(account) {
    this.row.append(
      Column.new(account.profilePic(), "col-md-3 d-flex justify-content-left"),
      Column.new(account.info(), "col-md d-flex justify-content-left")
    );
    return this.row;
  }

  programRow(program, target) {
    this.row.append(
      Column.new(
        program.program(target),
        "col-md d-flex justify-content-center"
      )
    );
    return this.row;
  }

  workoutRow(workout, target) {
    this.row.append(
      Column.new(
        workout.workout(target),
        "col-md d-flex justify-content-center"
      )
    );
    return this.row;
  }

  workoutExerciseRow(workout, exercise, target) {
    this.row.append(
      Column.new(workout.exercise(exercise, target), "col-md pt-1")
    );
    return this.row;
  }

  newProgramRow() {
    this.row.append(
      Column.new(Section.new(currentUser.renderNewProgramForm()), "col-md")
    );
    return this.row;
  }

  showProgramRow(program, target) {
    new Promise(res => {
      res(this.row.append(Column.new(program.show(target), "col-md pt-1")));
    }).then(() => {
      program.allExercises(target);
    });
    return this.row;
  }

  showWorkoutRow(workout, target) {
    new Promise(res => {
      res(this.row.append(Column.new(workout.show(target), "col-md pt-1")));
    }).then(() => {
      workout.allExercises(target);
    });
    return this.row;
  }

  showWorkoutExerciseRow(workout, exercise, target) {
    this.row.append(
      Column.new(workout.showExercise(exercise, target), "col-md pt-1")
    );
    return this.row;
  }

  showWorkoutExerciseHeaderRow(exercise) {
    this.row.append(
      Column.new(exercise.headerMenu(), "col-md pt-1")
    );
    this.row.id = `exercise_header_${exercise.id}`;
    return this.row;
  }

  showExerciseRow(exercise, target) {
    this.row.append(Column.new(exercise.show(), "col-md pt-1"));
    return this.row;
  }

  newExerciseRow(program) {
    this.row.append(
      Column.new(Section.new(program.renderNewExerciseForm()), "col-md")
    );
    return this.row;
  }
}
