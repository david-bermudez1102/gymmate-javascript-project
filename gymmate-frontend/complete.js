class CompleteExercise {
  constructor(id, workoutId, exerciseId, sets) {
    this._id = id;
    this._workoutId = workoutId;
    this._exerciseId = exerciseId;
    this._sets = sets;
    this._view = CompleteView.create(this);
    this._controller = CompleteController.create(this);
    this._render = CompleteRender.create(this);
  }
  get id() {
    return this._id;
  }

  get workoutId() {
    return this._workoutId;
  }

  get exerciseId() {
    return this._exerciseId;
  }

  get sets() {
    return this._sets;
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
      completeExercise.exercise_id,
      completeExercise.sets
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

  get complete() {
    return this._view.complete;
  }

  _form() {
    const formData = new FormData();
    const data = {
      workout_id: this.complete.workoutId,
      exercise_id: this.complete.exerciseId,
      sets: this.complete.sets + 1
    };
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return formData;
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
    new Fetch(
      this.complete.view.form._form(),
      "POST",
      `${BASE_URL}/completes`,
      json => {
        const user = Object.assign(new User(), currentUser);
        const workout = user.workouts.find(
          workout => workout.id === this.complete.workoutId
        );
        const exercise = workout.program.exercises.find(
          exercise => exercise.id === this.complete.exerciseId
        );
        workout.completeExercises.push(CompleteExercise.create(json));
        
        currentUser = user;
        this.complete.render.stats(workout, exercise);
      }
    ).submit();
  }

  update() {
    new Fetch(
      this.complete.view.form._form(),
      "PATCH",
      `${BASE_URL}/completes/${this.complete.id}`,
      json => {
        const user = Object.assign(new User(), currentUser);
        const workout = user.workouts.find(
          workout => workout.id === this.complete.workoutId
        );
        const exercise = workout.program.exercises.find(
          exercise => exercise.id === this.complete.exerciseId
        );
        Object.assign(
          workout.completeExercises.find(
            complete => complete.id === this.complete.id
          ),
          CompleteExercise.create(json)
        );
        this.complete.render.stats(workout, exercise);
      }
    ).submit();
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

  sets(workout, exercise) {
    const __exercise = d.querySelector(`#exercise_${exercise.id}`);
    __exercise
      .querySelector(`#exercise_sets_${exercise.id}`)
      .replaceWith(workout.view.sets(exercise));
  }

  progress(workout, exercise) {
    const __exercise = d.querySelector(`#exercise_${exercise.id}`);
    __exercise
      .querySelector(`#exercise_progress_${exercise.id}`)
      .replaceWith(exercise.view.progress(exercise));
  }

  caloriesBurnt(workout, exercise) {
    const __exercise = d.querySelector(`#exercise_${exercise.id}`);
    __exercise
      .querySelector(`#exercise_burnt_${exercise.id}`)
      .replaceWith(workout.view.caloriesBurnt(exercise));
  }

  stats(workout, exercise) {
    this.sets(workout, exercise)
    this.progress(workout, exercise)
    this.caloriesBurnt(workout, exercise)
  }
}
