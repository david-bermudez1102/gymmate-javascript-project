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
      ` ${this.workout.program.title}`
    );
  }

  status() {
    return this.workout.complete
      ? Elem.icon({
          class: "fas fa-check-square text-primary",
          style: "font-size: 24px;"
        })
      : Elem.icon({
          class: "fas fa-spinner text-primary",
          style: "font-size: 24px;"
        });
  }

  options() {
    return isOwner(this.workout.user)
      ? this.workout.user.accountView.options(this.workout, "#main_container")
      : "";
  }

  __workout(target) {
    return Elem.section(
      {
        class:
          "text-left p-3 p-sm-5 rounded shadow mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light"
      },
      null,
      this.title(),
      this.status()
    );
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `workout_${this.workout.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(`By ${this.workout.program.trainer.fullName}`),
      Elem.div({ class: "display-4" }, null, this.workout.program.description),
      Elem.video(this.workout.program.video),
      isUser() && !isOwner(this.workout.user)
        ? this.workout.program.form.startProgramBtn()
        : ""
    );
  }

  exerciseInfo(exercise) {
    return Elem.p(
      { class: "d-flex w-100 justify-content-between my-4" },
      null,
      "setsCompleted"
    );
  }

  __exercise(exercise) {
    const __exercise = exercise.view.__exercise();
    __exercise.append(this.progress(exercise));
    return __exercise;
  }

  percentageComplete(exercise) {
    return (
      (this.workout.completeExercises.length * 100) /
      this.workout.program.exercises.length
    );
  }

  progress(exercise) {
    return isUser()
      ? Elem.span(
          { class: " col order-2" },
          null,
          ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
        )
      : "";
  }

  showExercise(exercise) {
    const __exercise = this.__exercise(exercise);
    __exercise.append(this.form.startExercise(exercise));
    __exercise.className =
      "text-left w-100 d-flex align-items-center justify-content-between";
    const sectionClassName =
      "text-left p-3 p-sm-5 mt-1 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `exercise_${exercise.id}`
      },
      null,
      __exercise,
      Subtitle.new(
        `From "${exercise.program.title}" By ${exercise.program.trainer.fullName}`
      ),
      this.exerciseInfo(),
      exercise.view.video(),
      exercise.view.description()
    );

    return __exercise;
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

  startExercise(exercise) {
    return Elem.button(
      {
        class: "btn btn-primary btn-sm rounded-circle shadow",
        id: `start_exercise_${exercise.id}`
      },
      () => {
        const exerciseContainer = document.querySelector(
          `#exercise_${exercise.id}`
        );
        const video = exerciseContainer.querySelector("video");

        exerciseContainer.append(Layout.counter(5));
        video.addEventListener("timeupdate", () => {
          if (video.currentTime == video.duration)
            this.completeExercise(exercise);
        });
      },
      Elem.icon({
        class: "far fa-play-circle display-4",
        style: "font-size: 40px;"
      })
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

  add(json) {
    new Promise(res => res(Workout.add(json)))
      .then(user => (currentUser = user))
      .then(user => user.render.workouts("#main_container"));
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

  __exercise(exercise, target) {
    const __exercise = this.workout.view.__exercise(exercise);
    __exercise.addEventListener("click", () =>
      this.showExercise(exercise, target)
    );
    render(__exercise, target);
  }

  showExercise(exercise, target) {
    render(this.workout.program.view.__program(), target, true);
    render(this.workout.view.showExercise(exercise), target);
  }

  show(target) {
    render(this.workout.view.show(), target, true);
    render(this.workout.program.view.exercisesCount(), target);
    this.workout.program.exercises.forEach(exercise =>
      this.__exercise(exercise, target)
    );
    createRoute(`workouts("${pathName[1]}")`, `/workouts/${this.workout.id}`);
  }
}
