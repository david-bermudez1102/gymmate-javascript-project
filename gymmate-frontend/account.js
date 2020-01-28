class Account {
  constructor(name, lastname, username, email, password) {
    this._name = name;
    this._lastname = lastname;
    this._username = username;
    this._email = email;
    this._password = password;
  }

  get name() {
    return this._name;
  }

  get lastname() {
    return this._lastname;
  }

  get username() {
    return this._username;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get data() {
    return {
      account: {
        name: this.name,
        lastname: this.lastname,
        username: this.username,
        email: this.email,
        password: this.password
      }
    };
  }

  static logout(){
    const callback = json => {
      console.log(json);
      sessionStorage.clear();
      window.location.reload()
    };
    const req = new Fetch(
      null,
      "DELETE",
      DELETE_URL,
      callback
    );
    req.submit();
  }
}
