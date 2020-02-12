class CompleteExercise {
  constructor(id, workoutId, exerciseId, sets) {
    this._id = id;
    this._workoutId = workoutId;
    this._exerciseId = exerciseId;
    this._sets = sets;
    this._view = ExerciseView.create(this);
    this._controller = ExerciseController.create(this);
    this._render = ExerciseRender.create(this);
  }

  get workoutId() {
    return this._workoutId;
  }

  get exerciseId() {
    return this._exerciseId;
  }

  get sets() {
    return this._exerciseId;
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
    this._complete = complete;
    this._form = CompleteForm.create(this);
  }

  static create(complete) {
    return new CompleteView(complete);
  }

  get complete() {
    return this._complete;
  }

  get form() {
    return this._form;
  }

  sets() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-cog" }),
      ` ${this.complete.sets}`
    );
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
    this._complete = complete;
  }

  static create(complete) {
    return new CompleteController(complete);
  }

  get complete() {
    return this._complete;
  }

  __create() {
    const formData = new FormData();
    const data = {
      workout_id: this.complete.workoutId,
      exercise_id: this.complete.exerciseId
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
}

//===============================================================================//

class CompleteRender {
  constructor(complete) {
    this._complete = complete;
  }

  static create(complete) {
    return new CompleteRender(complete);
  }

  get complete() {
    return this._complete;
  }

}
