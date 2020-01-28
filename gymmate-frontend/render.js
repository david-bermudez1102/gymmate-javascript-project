class Render {
  constructor(json) {
    this._json = json;
  }

  get json() {
    return this._json;
  }

  static newUserForm(url) {
    const newUserForm = Form.new("new_user", url, "POST");
    const name = Input.new("text", "name", "Your Name...");
    const lastname = Input.new("text", "lastname", "Your Lastname...");
    const username = Input.new("text", "username", "Your Username...");
    const email = Input.new("email", "email", "Your Email...");
    const password = Input.new("password", "password", "Your Password...");
    const button = Button.new("create_user", "Sign Up", null, null, url);
    newUserForm.append(name, lastname, username, email, password, button);
    return newUserForm;
  }

  home() {
    if (this.json.message === "success") {
      setSession(this.json.auth_token);
      main.innerHTML = `Welcome ${this.json.name}`;
      main.append(this.logoutBtn());
    }
  }

  logoutBtn() {
    return Button.new("logout_button", "Log Out", null, Account.logout);
  }
}
