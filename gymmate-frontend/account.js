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

  edit() {}

  profilePic() {
    const div = Div.new(
      "w-100 mb-4 px-0 pb-2 text-dark text-center",
      `account_${this.id}_avatar`,
      null
    );
    div.append(H1.new(`${this.name} ${this.lastname}`, "text-primary"));
    div.append(
      Elem.form({ action: `${USERS_URL}/${this.id}` }, null, this.icon())
    );
    return div;
  }

  icon() {
    const file = Elem.input({
      type: "file",
      class: "d-none",
      name: "account[profile_picture]"
    });

    const label = Elem.label(
      {},
      null,
      file,
      Elem.icon({ class: "fas fa-user-circle", style: "font-size:15vw" })
    );

    file.addEventListener("change", () => {
      Picture.handleFiles(file.files, label, file);
    });

    return label;
  }
  info() {
    const div = Div.new(null, `account_${this.id}_info`, null);
    div.append(P.new(`Username: ${this.username}`));
    div.append(P.new(`Bio: ${this.bio}`));
    div.append(P.new(`Date of birth: ${this.dateOfBirth}`));
    div.append(P.new(`Sex: ${this.sex}`));
    return div;
  }

  options(content, target) {
    const optionsClassName =
      "col-lg-2 d-flex align-items-center order-1 order-sm-1 order-md-1 order-lg-2 justify-content-between";
    return Elem.div(
      { class: optionsClassName },
      null,
      this.editBtn(content, target),
      this.deleteBtn(content, target)
    );
  }

  deleteBtn(content, target) {
    return Elem.link(
      {
        class: "text-light",
        "data-toggle": "tooltip",
        "data-placement": "top",
        title: "Delete Routine"
      },
      () => {
        window.event.stopPropagation();
        const prompt = Elem.prompt(
          `Delete "${content.title}"`,
          "Are you sure you want to delete this routine?",
          "Yes, Delete",
          "No"
        );
        prompt
          .querySelector("#confirmBtnValue")
          .addEventListener("click", () => content.delete(target));
        append(prompt, "myModal", main);
        $("#myModal").modal("toggle");
      },
      Elem.icon({ class: "fas fa-trash" })
    );
  }

  editBtn(content, target) {
    return Elem.link(
      {
        class: "text-light",
        "data-toggle": "tooltip",
        "data-placement": "top",
        title: "Edit This Routine"
      },
      () => {
        window.event.stopPropagation();
        render(content.edit(), target, true);
      },
      Elem.icon({ class: "fas fa-pen" })
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
