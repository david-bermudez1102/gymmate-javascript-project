class Home {
  constructor() {
    this._view = HomeView.create(this);
    this._controller = HomeController.create(this);
    this._render = HomeRender.create(this);
  }

  get view() {
    return this._view;
  }

  get render() {
    return this._render;
  }

  get controller() {
    return this._controller;
  }
}

class HomeView {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeView(home);
  }

  get home() {
    return this._home;
  }

  show() {
    return Elem.div(
      { id: "home_row", class: "row" },
      null,
      this.menuCol(),
      this.mainContainerCol()
    );
  }

  menuCol() {
    return Elem.div(
      { class: "col-sm-6 col-md-5 col-lg-3 d-flex" },
      null,
      this.menu()
    );
  }

  mainContainerCol() {
    return Elem.div(
      { id: "main_container", class: "col-sm-6 col-md px-sm-1" },
      null,
      currentUser instanceof Trainer ? this.newProgramCol() : ""
    );
  }

  newProgramCol() {
    const program = new Program();
    return program.view.programFormRow(program.view.form.newProgram());
  }

  menu() {
    return Elem.div(
      {
        class:
          "nav flex-column w-100 flex-wrap nav-pills shadow p-4 rounded text-light",
        role: "tablist",
        "aria-orientation": "vertical",
        id: "v-pills-tab"
      },
      null,
      currentUser ? currentUser.accountView.profilePic() : "",
      this.homeLink(),
      this.messagesLink(),
      isTrainer() ? this.routinesLink() : this.workoutsLink(),
      this.profileLink()
    );
  }

  homeLink() {
    return Elem.link(
      { class: "nav-link active", "data-toggle": "pill" },
      () => this.home.render.show(),
      Elem.icon({
        class: "fas fa-th-list"
      }),
      " Home"
    );
  }

  profileLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      () => currentUser.render.profile(),
      Elem.icon({
        class: "fas fa-user-circle"
      }),
      " Profile"
    );
  }

  messagesLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      null,
      "Messages"
    );
  }

  routinesLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      () => currentUser.render.programs("#main_container"),
      Elem.icon({
        class: "fas fa-dumbbell"
      }),
      " My Routines"
    );
  }

  workoutsLink() {
    return Elem.link(
      {
        class: "nav-link",
        "data-toggle": "pill",
        id: "main_menu_workouts_link"
      },
      () => currentUser.render.workouts("#main_container"),
      "My Workouts"
    );
  }
}

class HomeController {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeController(home);
  }

  get home() {
    return this._home;
  }

  show() {
    this.home.render.show();
  }
}

class HomeRender {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeRender(home);
  }

  get home() {
    return this._home;
  }

  show() {
    loadNavbar();
    render(this.home.view.show(), "main", true);
    createRoute("home()", "/home");
  }
}
