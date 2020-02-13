class Exercise {
  constructor(
    id,
    title,
    description,
    sets,
    repetitions,
    video,
    calories,
    rest,
    program
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._sets = sets;
    this._repetitions = repetitions;
    this._video = video;
    this._calories = calories;
    this._rest = rest;
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

  get calories() {
    return this._calories;
  }

  get rest() {
    return this._rest;
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
      json.calories,
      json.rest,
      program
    );
  }

  duration() {
    return Math.round((this.repetitions * 15 + this.sets * this.rest) / 60);
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
      {
        class:
          "col-xl-9 col-lg-10 display-4 order-2 order-sm-2 order-md-2 order-lg-1 p-0",
        style: "font-size: 40px;"
      },
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

  percentageComplete(exercise) {
    return exercise
      ? Math.round((exercise.sets * 100) / this.exercise.sets)
      : 0;
  }

  progress(exercise) {
    return isUser()
      ? Elem.span(
          {
            id: `exercise_progress_${this.exercise.id}`,
            class: "text-right p-0 m-0 col order-2"
          },
          null,
          ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
        )
      : "";
  }

  __exercise() {
    return Elem.section(
      {
        class:
          "order-1 text-left p-3 p-sm-5 rounded shadow mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light flex-wrap",
        style: "cursor:pointer;"
      },
      null,
      this.title(),
      this.options(),
      this.info()
    );
  }

  sets() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-cog" }),
      ` ${this.exercise.sets}`
    );
  }

  reps() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-repeat" }),
      ` ${this.exercise.repetitions}`
    );
  }

  duration() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-clock" }),
      ` ${this.exercise.duration()} mins`
    );
  }

  calories() {
    return Elem.h2(
      {},
      null,
      Elem.icon({ class: "fas fa-fire" }),
      ` ${this.exercise.calories}`
    );
  }

  description() {
    return Elem.p(
      { class: "d-flex display-4 mt-4 text-justify", style: "font-size:20px;" },
      null,
      this.exercise.description
    );
  }

  info() {
    return Elem.p(
      { class: "d-flex w-100 justify-content-between my-4 order-2" },
      null,
      this.sets(),
      this.reps(),
      this.duration(),
      this.calories()
    );
  }

  video() {
    return Elem.video(this.exercise.video);
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 mt-1 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `exercise_${this.exercise.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(
        `From "${this.exercise.program.title}" By ${this.exercise.program.trainer.fullName}`
      ),
      this.info(),
      this.video(),
      this.description()
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

  exerciseFormRow(form) {
    return Elem.div(
      { class: "row" },
      null,
      Elem.div(
        { class: "col-md" },
        null,
        Elem.section(
          { class: "text-left p-3 p-sm-5 rounded shadow" },
          null,
          form
        )
      )
    );
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
        class: "needs-validation",
        novalidate: "novalidate"
      },
      handleSubmit,
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "exercise[title]",
          placeholder: "Enter a title for this exercise...",
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.title || "",
          "data-alert": "Enter a valid title.",
          required: true
        }),
        Elem.icon({ class: "fas fa-heading" })
      ),
      FormGroup.new(
        Elem.textArea(
          {
            name: "exercise[description]",
            placeholder: "Enter a description for this exercise...",
            class: "form-control pl-5 rounded",
            maxlength: "500",
            "data-alert": "Between 100 - 500 characters",
            required: true
          },
          null,
          this.exercise.description || ""
        ),
        Elem.icon({ class: "fas fa-quote-left" })
      ),
      fileUploader("exercise[video]", this.exercise.video),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[sets]",
          placeholder: "How many sets?...",
          min: 3,
          max: 15,
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.sets || "",
          "data-alert": "Between 3 - 15 sets.",
          required: true
        }),
        Elem.icon({ class: "fas fa-cog" })
      ),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[repetitions]",
          placeholder: "How many reps?...",
          min: 5,
          max: 30,
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.repetitions || "",
          "data-alert": "Between 5 - 30 reps.",
          required: true
        }),
        Elem.icon({ class: "fas fa-repeat", title: "Repetitions" })
      ),
      Elem.input({
        type: "hidden",
        name: "exercise[program_id]",
        value: this.exercise.program.id || ""
      }),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[calories]",
          placeholder: "Calories this exercise will burn (aprox.)?...",
          min: 100,
          max: 500,
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.calories || "",
          "data-alert": "Between 100 - 500 calories.",
          required: true
        }),
        Elem.icon({ class: "fas fa-fire", title: "Repetitions" })
      ),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[rest]",
          placeholder: "Rest time between sets. (Max 60 seconds).",
          min: 10,
          max: 60,
          class: "form-control pl-5 rounded-pill",
          "data-alert": "Between 10 - 60 seconds.",
          value: this.exercise.rest || "",
          required: true
        }),
        Elem.icon({ class: "fas fa-clock", title: "Repetitions" })
      ),
      Elem.input(
        {
          name: "submit",
          type: "submit",
          class:
            "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
        },
        () => window.event.stopPropagation()
      ),
      Elem.button(
        {
          name: "cancel",
          class:
            "btn btn-lg btn-block btn-dark border-0 shadow rounded-pill mb-3"
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
    form.cancel.append("Add later");
    form.cancel.addEventListener("click", () =>
      this.exercise.program.render.show("#main_container")
    );
    return form;
  }

  edit() {
    const form = this._form(
      `edit_exercise_${this.exercise.id}`,
      "PATCH",
      `${EXERCISES_URL}/${this.exercise.id}`,
      json => this.exercise.controller.update(json)
    );
    form.prepend(
      Elem.h1(
        { class: "text-primary mb-4" },
        null,
        Elem.icon({ class: "fas fa-edit" }),
        " Update Exercise"
      )
    );
    form.submit.value = "Update Exercise";
    form.cancel.append("Cancel");
    form.cancel.addEventListener("click", () => window.history.back());
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
    const exercise = Exercise.create(this.exercise.program, json);
    trainer.programs
      .find(program => program.id === json.program.id)
      .exercises.push(exercise);
    exercise.render.show("#main_container");
    currentUser = trainer;
  }

  update(json) {
    if (isTrainer && isOwner(this.exercise.program.trainer)) {
      const trainer = Object.assign(new Trainer(), currentUser);
      const program = trainer.programs.find(
        program => this.exercise.program.id === program.id
      );
      const exercise = Exercise.create(this.exercise.program, json);
      Object.assign(
        program.exercises.find(e => e.id === exercise.id),
        exercise
      );
      exercise.render.show("#main_container");
      currentUser = trainer;
    }
  }

  delete(target) {
    new Fetch(
      null,
      "DELETE",
      `${EXERCISES_URL}/${this.exercise.id}`,
      json => {
        const trainer = Object.assign(new Trainer(), currentUser);
        const program = trainer.programs.find(
          program => this.exercise.program.id === program.id
        );
        program.exercises = program.exercises.filter(e => e.id !== json.id);
        currentUser = trainer;
        program.render.show(target);
        return trainer;
      },
      target
    ).submit();
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

  newExerciseRow(target, remove = true) {
    render(
      this.exercise.view.exerciseFormRow(this.exercise.view.form.newExercise()),
      target,
      remove
    );
  }

  editRow(target) {
    render(
      this.exercise.view.exerciseFormRow(this.exercise.view.form.edit()),
      target,
      true
    );
  }

  __exercise(target) {
    const exercise = this.exercise.view.__exercise();
    exercise.addEventListener("click", () => this.show(target));
    render(exercise, target);
  }

  show(target) {
    this.exercise.program.render.__program(target, true);
    render(this.exercise.view.show(), target, false);
    createRoute("exercise()", `/exercises/${this.exercise.id}`);
  }
}
