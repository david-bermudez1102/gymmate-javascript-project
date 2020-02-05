class Workout {
  constructor(id, user, program, complete, createdAt, updatedAt) {
    this._id = id;
    this._user = user;
    this._program = program;
    this._complete = complete;
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
    else container.append(Icon.new("fas fa-spinner text-primary", "font-size: 24px;"));

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
}
