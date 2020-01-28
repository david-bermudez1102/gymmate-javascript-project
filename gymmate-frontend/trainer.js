class Trainer {
  static new(url) {
    const newTrainer = Render.newUserForm(url);
    
    newTrainer.create_user.addEventListener("click", () => {
      const trainer = new Account(
        newTrainer.name.value,
        newTrainer.lastname.value,
        newTrainer.username.value,
        newTrainer.email.value,
        newTrainer.password.value
      );
      const callback = json => {
        console.log(json);
        const render = new Render(json);
        render.home();
      };

      const req = new Fetch(trainer.data, "POST", TRAINERS_URL, callback);
      req.submit();
    });
    main.append(newTrainer);
  }
}