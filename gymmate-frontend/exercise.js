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
      },
      sessionStorage.getItem("auth_token")
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
        id: this.program.id,
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
