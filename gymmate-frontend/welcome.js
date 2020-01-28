class Welcome {
  static renderMenu() {
    this.newTrainerBtn = Button.new(
      "new_trainer_btn",
      "Trainer",
      null,
      Trainer.new,
      TRAINERS_URL
    );
    this.newUserBtn = Button.new(
      "new_user_btn",
      "Gym Goer",
      null,
      User.new,
      USERS_URL
    );
    this.menu = document.createElement("div");
    this.menu.append("I am:", this.newTrainerBtn, this.newUserBtn);
    return this.menu;
  }
}

main.append(Welcome.renderMenu());
if(sessionStorage.getItem("auth_token")){
  const callback = json => {
    console.log(json);
    const render = new Render(json);
    render.home();
  };

  const user = new Fetch(
    null,
    null,
    ACCOUNTS_URL + `/${sessionStorage.getItem("auth_token")}`,
    callback
  );
  user.request();
}