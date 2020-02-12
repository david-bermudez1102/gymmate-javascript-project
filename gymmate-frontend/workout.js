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
      : Icon.new("fas fa-spinner text-primary", "font-size: 24px;");
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
      () => render(new Grid().showWorkoutRow(this, target), target, true),
      this.title(),
      this.status()
    );
  }

  exercise(exercise, target) {
    const container = Elem.section(
     { class: "mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-white" },
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
        id: `workout_${this.workout.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(`By ${this.workout.program.trainer.fullName}`),
      Elem.div({ class: "display-4" }, null, this.workout.program.description),
      Elem.video(this.workout.program.video),
      this.workout.program.view.exercisesCount(),
      isUser() && !owner(this.workout.user)
        ? this.workout.program.form.startProgramBtn()
        : ""
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
    return Elem.button(
      {
        class: "btn btn-primary btn-sm rounded-circle shadow",
        id: `start_exercise_${this.workout.exercise.id}`
      },
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
      },
      Elem.icon({
        class: "far fa-play-circle display-4",
        style: "font-size: 40px;"
      })
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
