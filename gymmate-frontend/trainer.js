class Trainer extends Account {
  constructor(
    id,
    name,
    lastname,
    dateOfBirth,
    sex,
    username,
    email,
    trainerId,
    programs
  ) {
    super(id, name, lastname, dateOfBirth, sex, username, email);
    this._trainerId = trainerId;
    this.programs = programs;
  }
  get trainerId() {
    return this._trainerId
  }

  static create(json) {
    const trainer = new Trainer(
      json.account.id,
      json.account.name,
      json.account.lastname,
      json.account.date_of_birth,
      json.account.sex,
      json.account.username,
      json.account.email,
      json.account.userable_id
    );
    trainer.programs = json.programs.map(program => Program.create(trainer, program));
    return trainer;
  }

  renderForm(target) {
    removeAll(target);
    const newTrainer = Welcome.newUserForm(TRAINERS_URL);
    newTrainer.prepend(H1.new("Sign Up As a Trainer"));
    target.append(newTrainer);
    newTrainer.append(
      Link.new("Sign up as a Gym Goer instead.", "small", () => {
        removeAll(target);
        new User().renderForm(target);
      })
    );
  }

  renderNewProgramForm() {
    return new Program().form();
  }

  allPrograms() {
    const mainContainer = d.querySelector("#main_container");
    removeAll(mainContainer);
    this.programs.forEach(program => {
      mainContainer.append(
        Section.new(program.title, "mt-1", () => {
          removeAll(mainContainer);
          append(
            new Grid().showProgramRow(program),
            `program_${program.id}`,
            mainContainer
          );
        })
      );
    });
  }
}
