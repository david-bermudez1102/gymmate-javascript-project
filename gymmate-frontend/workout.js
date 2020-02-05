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
}
