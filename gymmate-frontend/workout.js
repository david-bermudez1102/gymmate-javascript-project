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
      {
        class:
          "col-xl-9 col-lg-12 display-4 order-2 order-sm-2 order-md-2 order-lg-1 p-0",
        style: "font-size: 40px;"
      },
      null,
      Elem.icon({ class: "fas fa-dumbbell text-primary" }),
      ` ${this.workout.program.title}`
    );
  }

  subtitle(exercise) {
    return Subtitle.new(
      `From "${exercise.program.title}" By ${exercise.program.trainer.fullName}`
    );
  }

  percentageComplete() {
    const percentages = this.workout.program.exercises.map(exercise =>
      exercise.view.percentageComplete(this.completeExercise(exercise))
    );
    return percentages.reduce((memo, val) => memo + val);
  }

  progress() {
    return isUser()
      ? Elem.span(
          {
            id: `workout_progress_${this.workout.id}`,
            class: "text-right p-0 m-0 col order-2"
          },
          null,
          ProgressBar.new(this.percentageComplete(), "#FF304F")
        )
      : "";
  }

  status() {
    return this.workout.complete
      ? Elem.icon({
          class: "fas fa-check-square text-primary",
          style: "font-size: 24px;"
        })
      : this.progress();
  }

  options() {
    return isOwner(this.workout.user)
      ? Elem.div(
          {
            class:
              "col-xl-3 d-flex align-items-center order-1 order-sm-1 order-md-1 order-lg-2 justify-content-end"
          },
          null,
          this.workout.user.accountView.deleteBtn(
            this.workout,
            "#main_container"
          )
        )
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

  completeExercise(exercise) {
    return this.workout.completeExercises.find(
      complete => complete.exerciseId === exercise.id
    );
  }

  reps(exercise) {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-cog" }),
      this.completeExercise()
        ? ` ${this.completeExercise(exercise).sets} / ${
            this.completeExercise(exercise).sets
          }`
        : ` 0 / ${exercise.sets}`
    );
  }

  sets(exercise) {
    return Elem.h2(
      { id: `exercise_sets_${exercise.id}` },
      null,
      Elem.icon({ class: "fas fa-cog" }),
      this.completeExercise(exercise)
        ? ` ${this.completeExercise(exercise).sets} / ${exercise.sets}`
        : ` 0 / ${exercise.sets}`
    );
  }

  exerciseInfo(exercise) {
    return Elem.p(
      { class: "d-flex w-100 justify-content-between my-4" },
      null,
      this.sets(exercise)
    );
  }

  __exercise(exercise) {
    const __exercise = exercise.view.__exercise();
    __exercise.append(exercise.view.progress(this.completeExercise(exercise)));
    return __exercise;
  }

  showExercise(exercise) {
    const __exercise = this.__exercise(exercise);
    __exercise.append(this.form.startExercise(exercise));
    __exercise.className =
      "position-relative text-left w-100 d-flex align-items-center justify-content-between py-2";
    const sectionClassName =
      "text-left p-3 p-sm-5 mt-1 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `exercise_${exercise.id}`
      },
      null,
      __exercise,
      this.subtitle(exercise),
      this.exerciseInfo(exercise),
      exercise.view.video(),
      exercise.view.description()
    );
  }

  startExercise(exercise, video) {
    if (video.currentTime === video.duration) {
      this.completeExercise(exercise)
        ? this.completeExercise(exercise).controller.update()
        : this.workout.controller.createComplete(exercise);
      this.workout.render.rest(exercise);
    }
  }

  stopExercise(exercise) {
    const exerciseContainer = d.querySelector(`#exercise_${exercise.id}`);
    const video = exerciseContainer.querySelector("video");
    exerciseContainer.firstChild.lastChild.remove();

    video.removeEventListener("timeupdate", () =>
      this.startExercise(exercise, video)
    );
    video.controls = true;
    video.pause();
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

  get workout() {
    return this._view.workout;
  }

  startExercise(exercise) {
    return Elem.button(
      {
        class: "btn btn-primary btn-sm rounded-circle shadow",
        id: `start_exercise_${exercise.id}`
      },
      () => {
        this.workout.render.startExercise(exercise);

        this.workout.render.mutedMenu(exercise);
      },
      Elem.icon({
        class: "far fa-play-circle display-4",
        style: "font-size: 40px;"
      })
    );
  }

  stopExercise(exercise) {
    const mutedContainer = Layout.mutedContainer();

    d.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        this.workout.view.stopExercise(exercise);
      }
    });

    mutedContainer.append(
      Elem.button(
        {
          class:
            "btn btn-primary btn-sm rounded-circle p-0 shadow d-flex align-items-center justify-content-center",
          style: `width:60px; height:60px;`,
          id: `stop_exercise_${exercise.id}`
        },
        () => this.workout.view.stopExercise(exercise),
        Elem.icon({
          class: "fas fa-stop-circle",
          style: "font-size: 30px;"
        })
      )
    );
    return mutedContainer;
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

  __create(json) {
    const user = Object.assign(new User(), currentUser);
    const workout = Workout.create(user, json);
    user.workouts.push(workout);
    currentUser = user;
    currentUser.render.workouts("#main_container");
    return user;
  }

  createComplete(exercise) {
    return new CompleteExercise(
      null,
      this.workout.id,
      exercise.id,
      0
    ).controller.__create();
  }

  show() {
    this.workout.render.show();
  }

  delete(target) {
    new Fetch(
      null,
      "DELETE",
      `${WORKOUTS_URL}/${this.workout.id}`,
      json => {
        const user = Object.assign(new User(), currentUser);
        currentUser._workouts = currentUser._workouts.filter(
          workout => workout.id !== json.id
        );
        currentUser = user;
        currentUser.render.workouts(target, true);
      },
      target
    ).submit();
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

  show(target) {
    render(this.workout.view.show(), target, true);
    render(this.workout.program.view.exercisesCount(), target);
    this.workout.program.exercises.forEach(exercise => {
      this.__exercise(exercise, target);
    });
    createRoute(`workouts("${pathName[1]}")`, `/workouts/${this.workout.id}`);
  }

  showExercise(exercise, target) {
    render(this.workout.program.view.__program(), target, true);
    render(this.workout.view.showExercise(exercise), target);
  }

  mutedMenu(exercise) {
    const exerciseContainer = d.querySelector(`#exercise_${exercise.id}`);
    exerciseContainer.firstChild.append(
      this.workout.view.form.stopExercise(exercise)
    );
  }

  rest(exercise) {
    const exerciseContainer = d.querySelector(`#exercise_${exercise.id}`);
    if (this.workout.view.completeExercise(exercise).sets < exercise.sets) {
      console.log(this.workout.view.completeExercise(exercise).sets);
      exerciseContainer.append(Layout.counter(30));
    } else this.workout.view.stopExercise(exercise);
  }

  startExercise(exercise) {
    const exerciseContainer = d.querySelector(`#exercise_${exercise.id}`);
    const video = exerciseContainer.querySelector("video");

    exerciseContainer.append(Layout.counter(5));
    video.addEventListener("timeupdate", () =>
      this.workout.view.startExercise(exercise, video)
    );
    video.controls = true;
  }
}
