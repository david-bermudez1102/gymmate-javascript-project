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

  duration() {
    return Math.round((this.repetitions * 7 + this.sets * 30) / 60);
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
        class: "col-lg-10 display-4 order-2 order-sm-2 order-md-2 order-lg-1",
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
          "text-left p-3 p-sm-5 rounded shadow mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-light",
        style: "cursor:pointer;"
      },
      null,
      this.title(),
      this.options()
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
      ` ${this.exercise.repetitions}`
    );
  }

  description() {
    return Elem.p(
      { class: "display-4 mt-2", style: "font-size:32px;" },
      null,
      this.exercise.description
    );
  }

  info() {
    return Elem.p(
      { class: "d-flex w-100 justify-content-between my-4" },
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

  caloriesBurnt() {
    const calories = Span.new(null, "display-4");
    calories.append(Icon.new("fas fa-fire"), ` 250`);
    return calories;
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
      FormGroup.new(
        Elem.input({
          type: "text",
          name: "exercise[description]",
          placeholder: "Enter a title for this exercise...",
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.description || ""
        }),
        Elem.icon({ class: "fas fa-heading" })
      ),
      fileUploader("exercise[video]", this.exercise.video),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[sets]",
          placeholder: "How many sets?...",
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.sets || ""
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Elem.input({
          type: "number",
          name: "exercise[repetitions]",
          placeholder: "How many reps?...",
          class: "form-control pl-5 rounded-pill",
          value: this.exercise.repetitions || ""
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
    createRoute("exercise()", `/exercises/${this.exercise.id}`);
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
        program => this.exercise.program === program
      );
      const exercise = Object.assign(
        new Exercise(),
        Exercise.create(this.exercise.program, json)
      );
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
          program => this.exercise.program === program
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
  }
}
