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
}
