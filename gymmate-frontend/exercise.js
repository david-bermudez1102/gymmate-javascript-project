class Exercise {
  constructor(id, title, description, sets, repetitions, video, program) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._sets = sets;
    this._repetitions = repetitions;
    this._video = video;
    this._program = program;
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

  show() {
    const title = Span.new(null, "display-4", "font-size: 40px;");
    title.append(Icon.new("fas fa-running text-primary"), ` ${this.title}`);

    const section = Section.new(title, "bg-dark text-white");
    section.id = `exercise_${this.id}`;
    section.append(
      Video.new(this.video),
      Div.new(null, null, this.description),
      `Sets: ${this.sets}`,
      `Reps: ${this.repetitions}`
    );
    return section;
  }

  headerMenu() {
    const headerMenu = Span.new(
      null,
      "display-4 d-flex p-2 w-100 bg-white text-primary mb-1 align-items-center",
      "font-size: 40px;"
    );
    headerMenu.append(
      Icon.new("fas fa-chevron-left"),
      `  ${this.program.title}`
    );
    return headerMenu;
  }

  caloriesBurnt() {
    const calories = Span.new(null, "display-4");
    calories.append(Icon.new("fas fa-fire"), ` 250`);
    return calories;
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
      Elem.icon({ class: "fas fa-dumbbell text-primary" }),
      ` ${this.program.title}`
    );
  }

  status() {
    this.complete
      ? Elem.icon({
          class: "fas fa-check-square text-primary",
          style: "font-size: 24px;"
        })
      : Icon.new("fas fa-spinner text-primary", "font-size: 24px;");
  }

  options() {
    return isOwner(this.exercise.user)
      ? this.exercise.user.accountView.options(this.exercise, "#main_container")
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
      this.status()
    );
  }

  exercise(exercise, target) {
    const container = Elem.section(
      {
        class:
          "mt-1 w-100 d-flex align-items-center justify-content-between bg-dark text-white"
      },
      () => {
        removeAll(target);
        append(
          new Grid().showExerciseExerciseHeaderRow(exercise),
          `exercise_header_${exercise.id}`,
          target
        );
        append(
          new Grid().showExerciseExerciseRow(this, exercise, target),
          `exercise_${exercise.id}`,
          target
        );
      }
    );

    const title = Span.new(null, "display-4", "font-size: 40px;");
    title.append(Icon.new("fas fa-running text-primary"), ` ${exercise.title}`);
    container.append(title);
    container.append(
      ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
    );

    return container;
  }

  percentageComplete(exercise) {
    return (
      (this.completeExercises.length * 100) / this.program.exercises.length
    );
  }

  show() {
    const sectionClassName =
      "text-left p-3 p-sm-5 rounded shadow bg-dark text-white";
    return Elem.section(
      {
        class: sectionClassName,
        id: `exercise_${this.work.id}`
      },
      null,
      Elem.div({ class: "row" }, null, this.title(), this.options()),
      Subtitle.new(`By ${this.exercise.program.trainer.fullName}`),
      Elem.div({ class: "display-4" }, null, this.exercise.program.description),
      Elem.video(this.exercise.program.video),
      this.exercise.program.view.exercisesCount(),
      isUser() && !owner(this.exercise.user)
        ? this.exercise.program.form.startProgramBtn()
        : ""
    );
  }

  allExercises(target) {
    this.program.exercises.forEach(exercise => {
      append(
        new Grid().exerciseExerciseRow(this, exercise, target),
        `exercise_${exercise.id}`,
        target
      );
    });
  }

  showExercise(exercise, target) {
    const header = Div.new(
      "w-100 d-flex justify-content-between align-items-center flex-wrap"
    );

    const title = Span.new(null, "display-4 my-4", "font-size: 40px;");
    const footer = Div.new(
      "w-100 d-flex justify-content-between align-items-center"
    );

    title.append(Icon.new("fas fa-running text-primary"), ` ${exercise.title}`);

    header.append(
      title,
      this.startExerciseBtn(exercise),
      ProgressBar.new(this.percentageComplete(exercise), "#FF304F")
    );

    footer.append(
      Span.new(`Sets: ${exercise.sets}`, "display-4", "font-size: 40px;"),
      Span.new(
        `Reps: ${exercise.repetitions}`,
        "display-4",
        "font-size: 40px;"
      ),
      exercise.caloriesBurnt()
    );

    const section = Section.new(header, "position-relative bg-dark text-white");
    section.id = `exercise_${exercise.id}`;

    const video = Video.new(exercise.video);

    section.append(
      video,
      Div.new(null, null, P.new(exercise.description)),
      footer
    );
    return section;
  }

  completeExercise(exercise) {
    const formData = new FormData();
    const data = {
      exercise_id: this.id,
      exercise_id: exercise.id
    };
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    new Fetch(formData, "POST", `${BASE_URL}/completes`, json => {
      const user = Object.assign(new User(), currentUser);
      user.exercises.find(exercise =>
        exercise.completeExercises.push(CompleteExercise.create(json))
      );
      currentUser = user;
      console.log(json);
    }).submit();
  }

  startExerciseBtn(exercise) {
    return Button.new(
      `start_exercise_${exercise.id}`,
      Icon.new("far fa-play-circle display-4", "font-size: 40px;"),
      "btn btn-primary btn-sm rounded-circle shadow",
      () => {
        const exerciseContainer = document.querySelector(
          `#exercise_${exercise.id}`
        );
        const video = exerciseContainer.querySelector("video");

        exerciseContainer.append(Render.counter(5));
        video.addEventListener("timeupdate", () => {
          if (video.currentTime == video.duration)
            this.completeExercise(exercise);
        });
      }
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

  form() {
    const newExerciseForm = Form.new(
      "new_exercise",
      EXERCISES_URL,
      "POST",
      json => {
        const trainer = Object.assign(new Trainer(), currentUser);
        const exercise = Exercise.create(this.program, json);
        trainer.programs
          .find(program => program.id === json.program_id)
          .exercises.push(exercise);
        currentUser = trainer;
        Render.hideSpinner(main);
        if (d.querySelector("#main_container")) {
          const mainContainer = d.querySelector("#main_container");
          removeAll(mainContainer);
          mainContainer.append(new Grid().showProgramRow(this.program));
        }
      }
    );
    newExerciseForm.append(
      H1.new("Add New Exercise"),
      FormGroup.new(
        Input.new({
          type: "text",
          name: "exercise[title]",
          placeholder: "Enter title of exercise...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new({
          type: "text",
          name: "exercise[description]",
          placeholder: "Add a brief description for this exercise...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      fileUploader("exercise[video]"),
      FormGroup.new(
        Input.new({
          type: "number",
          name: "exercise[sets]",
          placeholder: "How many sets?...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new({
          type: "number",
          name: "exercise[repetitions]",
          placeholder: "How many reps?...",
          class: "form-control pl-5 rounded-pill"
        }),
        Icon.new("fas fa-envelope")
      ),
      Input.new({
        type: "hidden",
        name: "exercise[program_id]",
        value: this.program.id,
        class: "form-control pl-5 rounded-pill"
      }),
      Button.new(
        "create_exercise",
        "Create Exercise",
        "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
      ),
      Button.new(
        "done_with_exercises",
        "I am done adding exercises",
        "btn btn-lg btn-block btn-dark border-0 shadow rounded-pill mb-3"
      )
    );
    return newExerciseForm;
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
