class Workout {
  constructor(
    id,
    user,
    program,
    complete,
    completeExercises,
    createdAt,
    updatedAt
  ) {
    this._id = id;
    this._user = user;
    this._program = program;
    this._complete = complete;
    this._completeExercises = completeExercises;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._view = WorkoutView.create(this);
    this._controller = WorkoutController.create(this);
    this._render = WorkoutRender.create(this);
  }

  get id() {
    return this._id;
  }

  get user() {
    return this._user;
  }

  get program() {
    return this._program;
  }

  set program(program) {
    this._program = program;
  }

  get complete() {
    return this._complete;
  }

  get completeExercises() {
    return this._completeExercises;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get view() {
    return this._view;
  }

  get render() {
    return this._render;
  }

  get controller() {
    return this._controller;
  }

  static create(user, json) {
    const workout = new Workout(
      json.id,
      user,
      null,
      json.complete,
      json.completes.map(complete => CompleteExercise.create(complete)),
      json.created_at,
      json.updated_at
    );

    new Fetch(
      null,
      "GET",
      `${TRAINERS_URL}/${json.program.trainer_id}`,
      trainer => {
        workout.program = Program.create(Trainer.create(trainer), json.program);
        return workout;
      }
    ).request();
    return workout;
  }

  static add(json) {
    const user = Object.assign(new User(), currentUser);
    const workout = Workout.create(user, json);
    user.workouts.push(workout);
    return user;
  }
}

//===============================================================================//

class WorkoutView {
  constructor(workout) {
    this._workout = workout;
    this._form = WorkoutForm.create(this);
  }

  static create(workout) {
    return new WorkoutView(workout);
  }

  get workout() {
    return this._workout;
  }

  get form() {
    return this._form;
  }

  title() {
    return Elem.span(
      { class: "display-4", style: "font-size: 40px;" },
      null,
      Elem.icon({ class: "fas fa-dumbbell text-primary" }),
      ` ${this.program.title}`
    );
  }

  status() {
    this.complete
      ? Elem.icon({
          class: "fas fa-check-square text-primary",
          style: "font-size: 24px;"
        })
      : Icon.new("fas fa-spinner text-primary", "font-size: 24px;");
  }

  __workout(target) {
    return Elem.section(
      {
        class:
          "text-left p-3 p-sm-5 rounded shadow mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light"
      },
      () => render(new Grid().showWorkoutRow(this, target), target, true),
      this.title(),
      this.status()
    );
  }

  exercise(exercise, target) {
    const container = Section.new(
      "",
      "mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-white",
      () => {
        removeAll(target);
        append(
          new Grid().showWorkoutExerciseHeaderRow(exercise),
          `exercise_header_${exercise.id}`,
          target
        );
        append(
          new Grid().showWorkoutExerciseRow(this, exercise, target),
          `exercise_${exercise.id}`,
          target
        );
      }
    );

    const title = Span.new(null, "display-4", "font-size: 40px;");
    title.append(Icon.new("fas fa-running text-primary"), ` ${exercise.title}`);
    container.append(title);
    container.append(
      ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
    );

    return container;
  }

  percentageComplete(exercise) {
    return (
      (this.completeExercises.length * 100) / this.program.exercises.length
    );
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `workout_${this.work.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(`By ${this.workout.program.trainer.fullName}`),
      Elem.div({ class: "display-4" }, null, this.workout.program.description),
      Elem.video(this.workout.program.video),
      this.workout.program.view.exercisesCount(),
      isUser() ? this.form.startProgramBtn() : ""
    );
  }

  allExercises(target) {
    this.program.exercises.forEach(exercise => {
      append(
        new Grid().workoutExerciseRow(this, exercise, target),
        `exercise_${exercise.id}`,
        target
      );
    });
  }

  showExercise(exercise, target) {
    const header = Div.new(
      "w-100 d-flex justify-content-between align-items-center flex-wrap"
    );

    const title = Span.new(null, "display-4 my-4", "font-size: 40px;");
    const footer = Div.new(
      "w-100 d-flex justify-content-between align-items-center"
    );

    title.append(Icon.new("fas fa-running text-primary"), ` ${exercise.title}`);

    header.append(
      title,
      this.startExerciseBtn(exercise),
      ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
    );

    footer.append(
      Span.new(`Sets: ${exercise.sets}`, "display-4", "font-size: 40px;"),
      Span.new(
        `Reps: ${exercise.repetitions}`,
        "display-4",
        "font-size: 40px;"
      ),
      exercise.caloriesBurnt()
    );

    const section = Section.new(header, "position-relative bg-dark text-white");
    section.id = `exercise_${exercise.id}`;

    const video = Video.new(exercise.video);

    section.append(
      video,
      Div.new(null, null, P.new(exercise.description)),
      footer
    );
    return section;
  }

  completeExercise(exercise) {
    const formData = new FormData();
    const data = {
      workout_id: this.id,
      exercise_id: exercise.id
    };
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    new Fetch(formData, "POST", `${BASE_URL}/completes`, json => {
      const user = Object.assign(new User(), currentUser);
      user.workouts.find(workout =>
        workout.completeExercises.push(CompleteExercise.create(json))
      );
      currentUser = user;
      console.log(json);
    }).submit();
  }

  startExerciseBtn(exercise) {
    return Button.new(
      `start_exercise_${exercise.id}`,
      Icon.new("far fa-play-circle display-4", "font-size: 40px;"),
      "btn btn-primary btn-sm rounded-circle shadow",
      () => {
        const exerciseContainer = document.querySelector(
          `#exercise_${exercise.id}`
        );
        const video = exerciseContainer.querySelector("video");

        exerciseContainer.append(Render.counter(5));
        video.addEventListener("timeupdate", () => {
          if (video.currentTime == video.duration)
            this.completeExercise(exercise);
        });
      }
    );
  }
}

//===============================================================================//

class WorkoutForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new WorkoutForm(view);
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
    );
  }

  signup() {
    return Elem.form(
      { id: "new_user", method: "POST", novalidate: "true" },
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
        Icon.new("fas fa-user")
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
        Icon.new("fas fa-user")
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
        Icon.new("fas fa-at")
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
        Icon.new("fas fa-envelope")
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
        Icon.new("fas fa-lock")
      ),
      FormGroup.new(
        Elem.input(
          {
            type: "submit",
            id: "create_user",
            value: "Sign Up",
            class: "btn btn-block btn-primary border-0 shadow rounded-pill"
          },
          () => stopPropagation()
        )
      )
    );
  }
}

//===============================================================================//

class WorkoutController {
  constructor(workout) {
    this._workout = workout;
  }

  static create(workout) {
    return new WorkoutController(workout);
  }

  get workout() {
    return this._workout;
  }

  show() {
    this.workout.render.show();
  }
}

//===============================================================================//

class WorkoutRender {
  constructor(workout) {
    this._workout = workout;
  }

  static create(workout) {
    return new WorkoutRender(workout);
  }

  get workout() {
    return this._workout;
  }

  show() {
    render(this.workout.view.show(), "main", true);
    createRoute("workout()", "/workout");
  }
}
