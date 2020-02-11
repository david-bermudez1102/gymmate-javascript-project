class Exercise {
  constructor(id, title, description, sets, repetitions, video, program) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._sets = sets;
    this._repetitions = repetitions;
    this._video = video;
    this._program = program;
    this._view = ExerciseView.create(this);
    this._controller = ExerciseController.create(this);
    this._render = ExerciseRender.create(this);
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get sets() {
    return this._sets;
  }

  get repetitions() {
    return this._repetitions;
  }

  get video() {
    return this._video;
  }

  get program() {
    return this._program;
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

  static create(program, json) {
    return new Exercise(
      json.id,
      json.title,
      json.description,
      json.sets,
      json.repetitions,
      json.video,
      program
    );
  }
}

//===============================================================================//

class ExerciseView {
  constructor(exercise) {
    this._exercise = exercise;
    this._form = ExerciseForm.create(this);
  }

  static create(exercise) {
    return new ExerciseView(exercise);
  }

  get exercise() {
    return this._exercise;
  }

  get form() {
    return this._form;
  }

  title() {
    return Elem.span(
      { class: "display-4", style: "font-size: 40px;" },
      null,
      Elem.icon({ class: "fas fa-running text-primary" }),
      ` ${this.exercise.title}`
    );
  }

  options() {
    return isOwner(this.exercise.program.trainer)
      ? this.exercise.program.trainer.accountView.options(
          this.exercise,
          "#main_container"
        )
      : "";
  }

  __exercise(target) {
    return Elem.section(
      {
        class:
          "text-left p-3 p-sm-5 rounded shadow mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light"
      },
      () => render(new Grid().showExerciseRow(this, target), target, true),
      this.title(),
      this.options()
    );
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `exercise_${this.exercise.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(
        `From "${this.exercise.program.title}" By "${this.exercise.program.trainer.fullName}"`
      ),
      Elem.div({ class: "display-4" }, null, this.exercise.description),
      Elem.video(this.exercise.video),
      `Sets: ${this.exercise.sets}`,
      `Reps: ${this.exercise.repetitions}`,
      isUser() && !owner(this.workout.user)
        ? this.workout.program.form.startProgramBtn()
        : ""
    );
  }

  headerMenu() {
    return Elem.span(
      {
        class:
          "display-4 d-flex p-2 w-100 bg-white text-primary mb-1 align-items-center",
        style: "font-size: 40px;"
      },
      null,
      Elem.icon("fas fa-chevron-left"),
      `  ${this.exercise.program.title}`
    );
  }

  caloriesBurnt() {
    const calories = Span.new(null, "display-4");
    calories.append(Icon.new("fas fa-fire"), ` 250`);
    return calories;
  }
}

//===============================================================================//

class ExerciseForm {
  constructor(view) {
    this._view = view;
  }

  static create(view) {
    return new ExerciseForm(view);
  }

  get view() {
    return this._view;
  }

  get exercise() {
    return this._view.exercise;
  }

  _form(id, method, action, handleSubmit) {
    return Elem.form(
      {
        id: id,
        method: method,
        action: action,
        class: "needs-validation"
      },
      handleSubmit,
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "exercise[title]",
          placeholder: "Enter a title for this exercise...",
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.title || ""
        }),
        Elem.icon({ class: "fas fa-heading" })
      ),
      fileUploader("exercise[video]", this.exercise.video),

      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[sets]",
          placeholder: "How many sets?...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[repetitions]",
          placeholder: "How many reps?...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      Elem.input({
        type: "hidden",
        name: "exercise[program_id]",
        value: this.exercise.program.id
      }),
      Elem.input(
        {
          id: "create_exercise",
          name: "submit",
          type: "submit",
          class:
            "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
        },
        () => window.event.stopPropagation()
      ),
      Elem.input(
        {
          id: "close_new_exercise_container",
          name: "submit",
          type: "submit",
          class:
            "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
        },
        () => window.event.stopPropagation()
      )
    );
  }

  newExercise() {
    const form = this._form("new_exercise", "POST", EXERCISES_URL, json =>
      this.exercise.controller.createExercise(json)
    );
    form.prepend(
      Elem.h1(
        { class: "text-primary mb-4" },
        null,
        Elem.icon({ class: "fas fa-running text-primary" }),
        " Create Exercise"
      )
    );
    form.submit.value = "Create Exercise";
    return form;
  }

  edit() {
    const form = this._form(
      `edit_exercise_${this.exercise.id}`,
      "PATCH",
      `${EXERCISES_URL}/${this.exercise.id}`,
      () => this.exercise.controller.update(json)
    );
    form.prepend(
      Elem.h1(
        { class: "text-primary mb-4" },
        null,
        Elem.icon({ class: "fas fa-edit" }),
        " Update Exercise"
      )
    );
    form.submit.value = "Create Exercise";
    return form;
  }
}

//===============================================================================//

class ExerciseController {
  constructor(exercise) {
    this._exercise = exercise;
  }

  static create(exercise) {
    return new ExerciseController(exercise);
  }

  get exercise() {
    return this._exercise;
  }

  show() {
    this.exercise.render.show();
  }

  createExercise(json) {
    const trainer = Object.assign(new Trainer(), currentUser);
    const exercise = Exercise.create(this.program, json);
    trainer.programs
      .find(program => program.id === json.program_id)
      .exercises.push(exercise);
    currentUser = trainer;
    this.exercise.program.render.show("#main_container")
  }
}

//===============================================================================//

class ExerciseRender {
  constructor(exercise) {
    this._exercise = exercise;
  }

  static create(exercise) {
    return new ExerciseRender(exercise);
  }

  get exercise() {
    return this._exercise;
  }

  show() {
    render(this.exercise.view.show(), "main", true);
    createRoute("exercise()", "/exercise");
  }
}
