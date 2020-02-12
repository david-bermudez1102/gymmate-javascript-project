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

//===============================================================================//

class CompleteView {
  constructor(complete) {
    this._workout = complete;
    this._form = CompleteForm.create(this);
  }

  static create(complete) {
    return new CompleteView(complete);
  }

  get complete() {
    return this._workout;
  }

  get form() {
    return this._form;
  }
}

//===============================================================================//

class CompleteForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new CompleteForm(view);
  }

  get view() {
    return this._view;
  }

 
}

//===============================================================================//

class CompleteController {
  constructor(complete) {
    this._workout = complete;
  }

  static create(complete) {
    return new CompleteController(complete);
  }

  get complete() {
    return this._workout;
  }

 
}

//===============================================================================//

class CompleteRender {
  constructor(complete) {
    this._workout = complete;
  }

  static create(complete) {
    return new CompleteRender(complete);
  }

  get complete() {
    return this._workout;
  }

}
