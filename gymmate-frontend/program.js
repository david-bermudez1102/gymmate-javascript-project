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

  static create(trainer, json) {
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
    program.exercises = json.exercises.map(exercise =>
      Exercise.create(program, exercise)
    );

    return program;
  }

  form(method, title, action, handleSubmit) {
    return Element.form(
      {
        id: "new_program",
        method: method,
        action: `${PROGRAMS_URL}/${this.id || ""}`,
        class: "needs-validation"
      },
      handleSubmit,
      title,
      FormGroup.new(
        Element.input({
          type: "text",
          name: "program[title]",
          placeholder: "Enter a title for your program...",
          class: "form-control pl-5 rounded-pill",
          value: this.title || ""
        }),
        Element.icon({ class: "fas fa-heading" })
      ),
      fileUploader("program[video]", this.video),
      FormGroup.new(
        Element.textArea(
          {
            class: "form-control pl-5",
            name: "program[description]",
            placeholder: "Enter a brief description for your program..."
          },
          null,
          this.description || ""
        ),
        Element.icon({ class: "fas fa-quote-left" })
      ),
      Button.new(
        "create_program",
        `${action}`,
        "btn btn-lg btn-block btn-primary border-0 shadow rounded-pill mb-3"
      )
    );
  }

  renderNewExerciseForm() {
    return new Exercise(null, null, null, null, null, null, this).form();
  }

  allExercises(target) {
    this.exercises.forEach(exercise => {
      append(
        new Grid().showExerciseRow(exercise, target),
        `exercise_${exercise.id}`,
        target
      );
    });
  }

  exercisesCount() {
    if (this.exercises.length === 0) {
      return "This program has no exercises yet.";
    } else {
      return Link.new(
        { href: "#" },
        () => this.allExercises(),
        `${this.exercises.length} Exercises.`
      );
    }
  }

  program(target) {
    const container = Section.new(
      "",
      "row mt-1 w-100 bg-dark text-white",
      () => {
        removeAll(target);
        append(
          new Grid().showProgramRow(this, target),
          `program_${this.id}`,
          target
        );
      }
    );

    const title = Span.new(
      null,
      "col-lg-10 display-4 order-2 order-sm-2 order-md-2 order-lg-1",
      "font-size: 36px;"
    );
    title.append(Icon.new("fas fa-dumbbell text-primary"), ` ${this.title}`);
    container.append(title);
    if (isOwner(this.trainer))
      container.append(this.trainer.options(this, target));
    if (isUser()) container.append(this.startProgramBtn());
    return container;
  }

  show() {
    const mainContainer = d.querySelector("#main_container");
    const title = Span.new(null, "display-4 my-4", "font-size: 40px;");

    title.append(Icon.new("fas fa-dumbbell"), ` ${this.title}`);

    const section = Section.new(title, "bg-dark text-white");

    section.id = `program_${this.id}`;
    section.append(
      Subtitle.new(`By ${this.trainer.name} ${this.trainer.lastname}`),
      Div.new(null, null, this.description),
      Video.new(this.video),
      this.exercisesCount()
    );
    if (isTrainer && currentUser == this.trainer)
      section.append(
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
    if (isUser()) section.append(this.startProgramBtn());
    return section;
  }

  edit() {
    if (isTrainer && isOwner(currentUser))
      return Element.section(
        { class: "text-left p-3 p-sm-5 rounded shadow " },
        null,
        this.form(
          "PATCH",
          Element.h1(
            { class: "text-primary mb-4" },
            null,
            Element.icon({ class: "fas fa-edit" }),
            " Edit Routine"
          ),
          "Update Routine",
          this.update
        )
      );
  }

  update(json) {
    if (isTrainer && isOwner(currentUser)) {
      const trainer = Object.assign(new Trainer(), currentUser);
      const program = Object.assign(
        new Program(),
        Program.create(trainer, json)
      );
      Object.assign(
        trainer.programs.find(p => p.id === program.id),
        program
      );
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
    }
  }

  delete(target) {
    new Fetch(
      null,
      "DELETE",
      `${PROGRAMS_URL}/${this.id}`,
      json => {
        Render.hideSpinner(main);
        const trainer = Object.assign(new Trainer(), currentUser);
        trainer.programs = trainer.programs.filter(
          program => program.id !== json.id
        );
        currentUser = trainer;
        removeAll(target);
        currentUser.allPrograms(target);
        console.log(json);
      },
      target
    ).submit();
  }

  startProgramBtn() {
    const form = Form.new("new_workout", WORKOUTS_URL, "POST", json => {
      Render.hideSpinner(main);
      const user = Object.assign(new User(), currentUser);
      const workout = Workout.create(user, json);
      user.workouts.push(workout);
      currentUser = user;
      if (d.querySelector("#main_container")) {
        const mainContainer = d.querySelector("#main_container");
        removeAll(mainContainer);
        currentUser.allWorkouts(mainContainer);
      }
    });
    form.append(
      Input.new({ type: "hidden", name: "workout[program_id]", id: this.id }),
      Button.new(
        `start_routine_button_${this.id}`,
        `Add this routine to my workouts`,
        "btn btn-primary shadow"
      )
    );
    return form;
  }
}
