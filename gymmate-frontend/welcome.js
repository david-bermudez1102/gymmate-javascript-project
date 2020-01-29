class Welcome {
  static renderMenu() {
    const menu = document.createElement("row");
    const newTrainerBtn = Button.new(
      "new_trainer_btn",
      "Trainer",
      null,
      Trainer.new,
      TRAINERS_URL
    );
    const newUserBtn = Button.new(
      "new_user_btn",
      "Gym Goer",
      null,
      User.new,
      USERS_URL
    );

    menu.append("I am:", newTrainerBtn, newUserBtn);
    return menu;
  }

  static card(title, className = "card-tooltip") {
    const card = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardFooter = document.createElement("div");
    card.className = `card ${className} h-100 border-0 p-1 p-sm-5 shadow-sm`;
    cardBody.className =
      "card-body p-0 pt-5 d-flex align-items-center justify-content-center";
    cardBody.cardFooter = "card-footer p-0 text-light";
    cardBody.innerHTML = `
    <h3 class="card-title">
      <a href="#" class="text-light">${title}</a>
    </h3>`;

    card.append(cardBody, cardFooter);
    return card;
  }

  static socialMediaOptions() {
    const options = `
      <div class="w-100 text-center">
        <h4 class="text-dark">OR LOGIN/SIGNUP WITH</h4>
      </div>
      <div class="d-flex w-100 justify-content-around">
        <a href="#" class="btn-facebook"><i class="fab fa-facebook-square"></i></a>
        <a href="#" class="text-success"><i class="fab fa-instagram"></i></a>
        <a href="#" class="btn-twitter"><i class="fab fa-twitter-square"></i></a>
      </div>`;
    const section = d.createElement("div");
    section.innerHTML = options;
    return section;
  }

  static render() {
    Render.spinner(main);
    setTimeout(() => {
      main.append(
        new Grid().headerRow(),
        new Grid().loginRow(),
        new Grid().signupRow()
      );
      Render.hideSpinner(main);
    }, 200);
  }
}

if (sessionStorage.getItem("auth_token")) {
  const callback = json => {
    console.log(json);
    Render.hideSpinner(main);
    new Render(json).home();
  };
  new Fetch(null, null, ACCOUNT_URL, callback).request();
} else {
  Welcome.render();
}
