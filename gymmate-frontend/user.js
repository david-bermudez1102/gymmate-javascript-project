class User {
  static new(url) {
    const newUser = Render.newUserForm(url);

    newUser.create_user.addEventListener("click", () => {
      const user = new Account(
        newUser.name.value,
        newUser.lastname.value,
        newUser.username.value,
        newUser.email.value,
        newUser.password.value
      );
      const submit = new Fetch(user.data, "POST", USERS_URL);
      submit.request();
    });
    main.append(newUser);
  }
}
