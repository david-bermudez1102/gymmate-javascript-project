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

  searchBar() {
    return Elem.form(
      { class: "mx-auto", id: "new_search", action: SEARCH_URL, method: "GET" },
      json => this.search.controller.createSearch(json),
      Elem.div(
        { class: "input-group" },
        null,
        Elem.input({
          type: "search",
          name: "query",
          placeholder: "Search routines, trainers, etc...",
          class:
            "form-control rounded-top-left-50 rounded-bottom-left-50 border-0",
          value: new URLSearchParams(location.search).get("query") || ""
        }),
        Elem.span(
          { class: "input-group-append" },
          null,
          Elem.div(
            {
              class:
                "input-group-text bg-white rounded-top-right-50 rounded-bottom-right-50 border-0"
            },
            null,
            Elem.icon({ class: "fa fa-search" })
          )
        )
      )
    );
  }

  trainersFound(total) {
    return Elem.span(
      { class: "d-flex my-3 text-primary display-4", style:"font-size:30px;" },
      null,
      `Trainers - ${total} ${total === 1 ? " match" : "match"}`
    );
  }

  usersFound(total) {
    return Elem.span(
      { class: "d-flex my-3 text-primary display-4", style: "font-size:30px;" },
      null,
      `Users - ${total} ${total === 1 ? " match" : "match"}`
    );
  }

  programsFound(total) {
    return Elem.h2(
      { class: "d-flex my-3 text-primary display-4", style: "font-size:30px;" },
      null,
      `Routines - ${total} ${total === 1 ? " match" : "match"}`
    );
  }

  totalMatches(content) {
    return content.length;
  }

  trainers(json) {
    return json.trainers.map(trainer =>
      Trainer.create(trainer).view.__trainer()
    );
  }

  users(json) {
    return json.users.map(user => User.create(user).view.__user());
  }

  programs(json) {
    return json.programs.map(program =>
      new Fetch(null, "GET", `${TRAINERS_URL}/${program.trainer_id}`, trainer =>
        Program.create(Trainer.create(trainer), program)
      ).request()
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

  createSearch(json) {
    if (!main.querySelector("#home_row")) {
      new Promise(res =>
        res(render(new Grid().homeRow(), "main", true))
      ).then(() =>
        this.search.render.index(
          json,
          new FormData(d.querySelector("#new_search"))
        )
      );
    } else {
      this.search.render.index(
        json,
        new FormData(d.querySelector("#new_search"))
      );
    }
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

  index(json, formData) {
    removeAll(d.querySelector("#main_container"));
    this.trainersFound(json);
    this.trainers(json);
    this.usersFound(json);
    this.users(json);
    this.programsFound(json);
    this.programs(json);
    createRoute(
      `search()`,
      `/search/?${new URLSearchParams(formData).toString()}`
    );
  }

  trainersFound(json) {
    const total = this.search.view.totalMatches(
      this.search.view.trainers(json)
    );
    total > 0
      ? render(this.search.view.trainersFound(total), "#main_container")
      : "";
  }

  usersFound(json) {
    const total = this.search.view.totalMatches(this.search.view.users(json));
    total > 0
      ? render(this.search.view.usersFound(total), "#main_container")
      : "";
  }

  programsFound(json) {
    const total = this.search.view.totalMatches(
      this.search.view.programs(json)
    );
    total > 0
      ? render(this.search.view.programsFound(total), "#main_container")
      : "";
  }

  trainers(json) {
    this.search.view
      .trainers(json)
      .forEach(trainer => render(trainer, "#main_container"));
  }

  users(json) {
    this.search.view
      .users(json)
      .forEach(user => render(user, "#main_container"));
  }

  programs(json) {
    this.search.view
      .programs(json)
      .forEach(result =>
        result.then(program => program.render.__program("#main_container"))
      );
  }
}
