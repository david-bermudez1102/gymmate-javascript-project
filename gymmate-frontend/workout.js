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
      "mt-1 w-100 d-flex align-items-center justify-content-between",
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

  show() {
    const mainContainer = d.querySelector("#main_container");
    const section = Section.new(
      H1.new(`${this.program.title}`, "text-primary")
    );
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
        new Grid().showWorkoutExerciseRow(this, exercise),
        `exercise_${exercise.id}`,
        target
      );
    });
  }

  showExercise(exercise) {
    const section = Section.new(H1.new(exercise.title));
    section.id = `exercise_${exercise.id}`;
    section.append(Progress.new({value:25,max:100}));

    const video = Video.new(exercise.video);

    video.addEventListener("timeupdate", () => {
      if (video.currentTime == video.duration) this.completeExercise(exercise);
    });

    section.append(
      video,
      Div.new(null, null, exercise.description),
      `Sets: ${exercise.sets}`,
      `Reps: ${exercise.repetitions}`
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
}
