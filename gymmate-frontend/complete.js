class Complete {
  constructor(id, workoutId, exerciseId) {
    this._id = id;
    this._workoutId = workoutId;
    this._exerciseId = exerciseId;
  }

  get workoutId() {
    return this._workoutId;
  }

  get exerciseId() {
    return this._exerciseId;
  }

  static create(complete) {
    return new Complete(complete.id,complete.workout_id,complete.exercise_id)
  }
}