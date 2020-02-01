class Exercise {
  constructor(id, title, sets, program) {
    this._id = id;
    this._title = title;
    this._sets = sets;
    this._program = program;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get sets() {
    return this._sets;
  }

  get program() {
    return this._program;
  }

  form() {
    const newExerciseForm = Form.new(
      "new_exercise",
      EXERCISES_URL,
      "POST",
      "exercise",
      json => {
        const trainer = Object.assign({}, currentUser);
        trainer.programs
          .find(program => program.id === json.program_id)
          .exercises.push(new Exercise(json.id, json.title, json.sets, this));
        currentUser = trainer;
        Render.hideSpinner(main);
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
        Input.new("text", "sets", "How many sets?..."),
        Icon.new("fas fa-envelope")
      ),
      Input.new("hidden", "program_id", null, null, this.program.id),
      Button.new(
        "create_exercise",
        "Create Exercise",
        "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
      )
    );
    return newExerciseForm;
  }
}
