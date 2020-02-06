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
        Render.hideSpinner(main);
        workout._program = Program.create(
          Trainer.create(trainer),
          json.program
        );
      }
    ).request();

    return workout;
  }

  workout(target) {
    const container = Section.new(
      "",
      "mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light",
      () => {
        removeAll(target);
        append(
          new Grid().showWorkoutRow(this, target),
          `workout_${this.id}`,
          target
        );
      }
    );

    const title = Span.new(null, "display-4", "font-size: 40px;");
    title.append(
      Icon.new("fas fa-dumbbell text-primary"),
      ` ${this.program.title}`
    );
    container.append(title);
    if (this.complete)
      container.append(
        Icon.new("fas fa-check-square text-primary", "font-size: 24px;")
      );
    else
      container.append(
        Icon.new("fas fa-spinner text-primary", "font-size: 24px;")
      );

    return container;
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

  show(target) {
    removeAll(target);

    const title = Span.new(null, "display-4 my-4", "font-size: 40px;");

    title.append(
      Icon.new("fas fa-running text-primary"),
      ` ${this.program.title}`
    );

    const section = Section.new(title, "bg-dark text-white");
    section.id = `workout_${this.id}`;
    section.append(
      Subtitle.new(
        `By ${this.program.trainer.name} ${this.program.trainer.lastname}`
      ),
      Div.new(null, null, this.program.description),
      Video.new(this.program.video),
      this.program.exercisesCount()
    );
    return section;
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
      this.startExerciseBtn(exercise, `#exercise_${exercise.id}`),
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

    video.addEventListener("timeupdate", () => {
      if (video.currentTime == video.duration) this.completeExercise(exercise);
    });

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
      Render.hideSpinner(main);
      const user = Object.assign(new User(), currentUser);
      user.workouts.find(workout =>
        workout.completeExercises.push(CompleteExercise.create(json))
      );
      currentUser = user;
      console.log(json);
    }).submit();
  }

  startExerciseBtn(exercise, section) {
    return Button.new(
      `start_exercise_${exercise.id}`,
      Icon.new("far fa-play-circle display-4", "font-size: 40px;"),
      "btn btn-primary btn-sm rounded-circle shadow", () => document.querySelector(section).append(Render.counter(5))
    );
  }
}
