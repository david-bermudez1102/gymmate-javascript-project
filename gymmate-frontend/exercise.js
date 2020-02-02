class Exercise {
  constructor(id, title, description, sets, program) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._sets = sets;
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

  get program() {
    return this._program;
  }

  form() {
    const mainContainer = d.querySelector("#main_container");
    const newExerciseForm = Form.new(
      "new_exercise",
      EXERCISES_URL,
      "POST",
      "exercise",
      json => {
        const trainer = Object.assign({}, currentUser);
        const exercise = new Exercise(
          json.id,
          json.title,
          json.description,
          json.sets,
          this.program
        );

        trainer.programs
          .find(program => program.id === json.program_id)
          .exercises.push(
            exercise
          );
        currentUser = trainer;
        Render.hideSpinner(main);
        removeAll(main)
        mainContainer.append(new Grid().showProgramRow(this.program));
      },
      sessionStorage.getItem("auth_token")
    );
    newExerciseForm.append(
      H1.new("Add New Exercise"),
      FormGroup.new(
        Input.new("text", "title", "Enter title of exercise..."),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new(
          "text",
          "description",
          "Add a brief description for this exercise..."
        ),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        Input.new("number", "sets", "How many sets?..."),
        Icon.new("fas fa-envelope")
      ),
      Input.new("hidden", "program_id", null, null, this.program.id),
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
    const section = Section.new(H1.new(this.title));
    section.id = `exercise_${this.id}`;
    section.append(Div.new(null, null, this.description), `Sets: ${this.sets}`);
    return section;
  }
}
