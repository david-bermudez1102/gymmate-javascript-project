class User extends Account {
  constructor(id, name, lastname, dateOfBirth, sex, username, email, userId) {
    super(id, name, lastname, dateOfBirth, sex, username, email);
    this._userId = userId;
  }

  get userId() {
    return this._userId;
  }

  renderForm(target) {
    removeAll(target);
    const newUser = Welcome.newUserForm(USERS_URL);
    newUser.prepend(H1.new("Sign Up"));
    target.append(newUser);
    newUser.append(
      Link.new("Sign up as a Trainer instead.", "small", () => {
        removeAll(target);
        new Trainer().renderForm(target);
      })
    );
  }
}
