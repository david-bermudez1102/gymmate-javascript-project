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
    const div = Div.new(
      "w-100 mb-4 px-0 pb-2 text-dark text-center",
      `account_${this.id}_avatar`,
      null
    );
    div.append(H1.new(`${this.name} ${this.lastname}`, "text-primary"));
    div.append(Icon.new("fas fa-user-circle", "font-size:15vw"));
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

  options(url, content, target) {
    const editBtn = Link.new(
      { class: "text-light" },
      null,
      Icon.new("fas fa-pen")
    );

    const div = Div.new(
      "col-lg-2 d-flex align-items-center order-1 order-sm-1 order-md-1 order-lg-2 justify-content-between"
    );
    div.append(editBtn, this.deleteBtn(url, content, target));
    return div;
  }

  deleteBtn(url, content, target) {
    const handleOnclick = () =>
      new Fetch(
        null,
        "DELETE",
        `${url}/${content.id}`,
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

    return Element.link(
      {
        class: "text-light",
        "data-toggle": "tooltip",
        "data-placement": "top",
        title: "Delete Routine"
      },
      () => {
        const prompt = Element.prompt(
          `Delete "${content.title}"`,
          "Are you sure you want to delete this routine?",
          "Yes, Delete",
          "No"
        );
        prompt
          .querySelector("#confirmBtnValue")
          .addEventListener("click", handleOnclick);
        append(prompt, "myModal", main);
        $("#myModal").modal("toggle");
      },
      Icon.new("fas fa-trash")
    );
  }

  static logout() {
    const callback = json => {
      sessionStorage.clear();
      window.location.reload();
    };
    new Fetch(null, "DELETE", SESSION_URL, callback).submit();
  }
}
