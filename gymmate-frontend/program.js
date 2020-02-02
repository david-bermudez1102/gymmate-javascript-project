class Program {
  constructor(
    id,
    title,
    description,
    video,
    exercises,
    trainer,
    createdAt,
    updatedAt
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._video = video;
    this.exercises = exercises;
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

  get video() {
    return this._video;
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
      json => {
        const trainer = currentUser;
        const program = new Program(
          json.id,
          json.title,
          json.description,
          json.video,
          [],
          trainer,
          json.created_at,
          json.updated_at
        );
        trainer.programs.push(program);
        currentUser = trainer;
        Render.hideSpinner(main);
        if (d.querySelector("#main_container")) {
          const mainContainer = d.querySelector("#main_container");
          removeAll(mainContainer);
          append(
            new Grid().showProgramRow(program),
            `program_${program.id}`,
            mainContainer
          );
          mainContainer.append(new Grid().newExerciseRow(program));
        }
      },
      sessionStorage.getItem("auth_token")
    );
    newProgramForm.append(
      H1.new("Create Program"),
      FormGroup.new(
        Input.new(
          "text",
          "program[title]",
          "Enter a title for your program..."
        ),
        Icon.new("fas fa-envelope")
      ),
      fileUploader("program[video]"),
      FormGroup.new(
        TextArea.new(
          "program[description]",
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

  renderNewExerciseForm() {
    console.log(this);
    return new Exercise(null, null, null, null, this).form();
  }

  allExercises() {
    const mainContainer = d.querySelector("#main_container");
    this.exercises.forEach(exercise => {
      append(
        new Grid().showExerciseRow(exercise),
        `exercise_${exercise.id}`,
        mainContainer
      );
    });
  }

  exercisesCount() {
    if (this.exercises.length === 0) {
      return "This program has no exercises yet.";
    } else {
      return Link.new(`${this.exercises.length} Exercises.`, null, () =>
        this.allExercises()
      );
    }
  }

  show() {
    const mainContainer = d.querySelector("#main_container");
    const section = Section.new(H1.new(`${this.title}`, "text-primary"));
    section.id = `program_${this.id}`;
    section.append(
      Subtitle.new(`By ${this.trainer.name} ${this.trainer.lastname}`),
      Div.new(null, null, this.description),
      Video.new(this.video),
      this.exercisesCount(),
      Button.new(
        "add_new_exercise",
        "Add New Exercise",
        "btn btn-primary",
        () => {
          removeAll(mainContainer);
          mainContainer.append(new Grid().newExerciseRow(this));
        }
      )
    );
    return section;
  }
}
