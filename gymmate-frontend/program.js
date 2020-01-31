class Program {
  constructor(id, title, description, trainer, createdAt, updatedAt) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._trainer = trainer;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
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

  get trainer() {
    return this._trainer;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  form() {
    const newProgramForm = Form.new(
      "new_program",
      PROGRAMS_URL,
      "POST",
      "program",
      json => {
        const trainer = Object.assign({}, currentUser);
        trainer.programs.push(
          new Program(
            json.id,
            json.title,
            json.description,
            trainer,
            json.created_at,
            json.updated_at
          )
        );
        currentUser = trainer;
        Render.hideSpinner(main);
      },
      sessionStorage.getItem("auth_token")
    );
    newProgramForm.append(
      H1.new("Create Program"),
      FormGroup.new(
        Input.new("text", "title", "Enter a title for your program..."),
        Icon.new("fas fa-envelope")
      ),
      FormGroup.new(
        TextArea.new(
          "description",
          "Enter a brief description for your program..."
        ),
        Icon.new("fas fa-lock")
      ),
      Button.new(
        "create_program",
        "Create Program",
        "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
      )
    );

    return newProgramForm;
  }
}