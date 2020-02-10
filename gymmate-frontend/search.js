class Search {
  constructor() {
    this._view = SearchView.create(this);
    this._controller = SearchController.create(this);
    this._render = SearchRender.create(this);
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

class SearchView {
  constructor(search) {
    this._search = search;
  }

  static create(search) {
    return new SearchView(search);
  }

  get search() {
    return this._search;
  }

  show() {
    return Elem.div(
      { id: "search_row", class: "row" },
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
      currentUser.accountView.profilePic(),
      this.searchLink(),
      this.messagesLink(),
      isTrainer() ? this.routinesLink() : this.workoutsLink(),
      this.profileLink()
    );
  }

  searchLink() {
    return Elem.link(
      { class: "nav-link active", "data-toggle": "pill" },
      () => this.search.render.show(),
      "Search"
    );
  }

  profileLink() {
    return Elem.link(
      { class: "nav-link", "data-toggle": "pill" },
      () => currentUser.render.profile(),
      "Profile"
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
      "My Routines"
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

class SearchController {
  constructor(search) {
    this._search = search;
  }

  static create(search) {
    return new SearchController(search);
  }

  get search() {
    return this._search;
  }

  show() {
    this.search.render.show();
  }
}

class SearchRender {
  constructor(search) {
    this._search = search;
  }

  static create(search) {
    return new SearchRender(search);
  }

  get search() {
    return this._search;
  }

  show() {
    render(this.search.view.show(), "main", true);
    createRoute("search()", "/search");
  }
}
