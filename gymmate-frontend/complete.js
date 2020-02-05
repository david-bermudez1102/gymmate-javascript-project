class CompleteExercise {
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

  static create(completeExercise) {
    return new CompleteExercise(
      completeExercise.id,
      completeExercise.workout_id,
      completeExercise.exercise_id
    );
  }
}