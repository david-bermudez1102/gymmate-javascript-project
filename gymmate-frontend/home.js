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
}

class HomeView {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeView(home);
  }

  get home() {
    return this._user;
  }
}

class HomeController {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeView(home);
  }

  get home() {
    return this._user;
  }
}

class HomeRender {
  constructor(home) {
    this._home = home;
  }

  static create(home) {
    return new HomeView(home);
  }

  get home() {
    return this._user;
  }
}