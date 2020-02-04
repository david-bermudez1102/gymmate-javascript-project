class Account {
  constructor(id, name, lastname, bio, dateOfBirth, sex, username, email) {
    this._id = id;
    this._name = name;
    this._lastname = lastname;
    this._bio = bio;
    this._dateOfBirth = dateOfBirth;
    this._sex = sex;
    this._username = username;
    this._email = email;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get lastname() {
    return this._lastname;
  }

  get bio() {
    return this._bio;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  get sex() {
    return this._sex;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  profilePic() {
    const div = Div.new(null, `account_${this.id}_avatar`, null);
    div.append(H1.new(`${this.name}`));
    div.append(Icon.new("far fa-user-circle", "font-size:140px"));
    return div;
  }

  info() {
    const div = Div.new(null, `account_${this.id}_info`, null);
    div.append(P.new(`Username: ${this.username}`));
    div.append(P.new(`Bio: ${this.bio}`));
    div.append(P.new(`Date of birth: ${this.dateOfBirth}`));
    div.append(P.new(`Sex: ${this.sex}`));
    return div;
  }

  static logout() {
    const callback = json => {
      sessionStorage.clear();
      window.location.reload();
    };
    new Fetch(null, "DELETE", SESSION_URL, callback).submit();
  }
}
