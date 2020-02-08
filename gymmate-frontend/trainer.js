class Trainer extends Account {
  constructor(
    id,
    name,
    lastname,
    bio,
    dateOfBirth,
    sex,
    username,
    email,
    trainerId,
    programs
  ) {
    super(id, name, lastname, bio, dateOfBirth, sex, username, email);
    this._trainerId = trainerId;
    this.programs = programs;
  }
  get trainerId() {
    return this._trainerId;
  }

  set trainerId(trainerId) {
    this._trainerId = trainerId;
  }

  static create(json) {
    const trainer = new Trainer(
      json.account.id,
      json.account.name,
      json.account.lastname,
      json.account.bio,
      json.account.date_of_birth,
      json.account.sex,
      json.account.username,
      json.account.email,
      json.account.userable_id,
      []
    );
    trainer.programs = json.programs.map(program =>
      Program.create(trainer, program)
    );
    return trainer;
  }

  trainer(target) {
    removeAll(target);
    target.append(Section.new(this.name, null, () => this.show()));
  }

  show() {
    removeAll(main);
    main.append(new Grid().showProfileRow(this));
    main.append(this.menu());
    this.allPrograms(main);
    window.history.pushState(
      { load: `showTrainers("${pathName[1]}")` },
      null,
      `/trainers/${this.trainerId}`
    );
  }

  renderForm(target) {
    removeAll(target);
    const newTrainer = Welcome.newUserForm(TRAINERS_URL);
    newTrainer.prepend(H1.new("Sign Up As a Trainer"));
    target.append(newTrainer);
    newTrainer.append(
      Link.new({class:"small"}, () => {
        removeAll(target);
        new User().renderForm(target);
      }, "Sign up as a Gym Goer instead.")
    );
  }

  renderNewProgramForm() {
    const handleSubmit = json => {
      const trainer = Object.assign(new Trainer(), currentUser);
      const program = Program.create(trainer, json);
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
    };
    return new Program().form("POST", "Create a new Routine", "Create Routine",handleSubmit);
  }

  allPrograms(target) {
    this.programs.forEach(program => {
      append(new Grid().programRow(program, target), `program_${program.id}`, target);
    });
  }

  menu() {
    return new DOMParser().parseFromString(
      `<nav>
  <div class="nav nav-tabs" id="nav-tab" role="tablist">
    <a class="nav-item nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-home" role="tab" aria-controls="nav-home" aria-selected="true">Programs</a>
    <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Pictures</a>
    <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Videos</a>
  </div>
</nav>
`,
      "text/html"
    ).body.firstChild;
  }
}
