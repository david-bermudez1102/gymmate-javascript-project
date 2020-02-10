let state = { load: null };

(function() {
  window.history.replaceState(state, null, "");
})();

const createRoute = (view, path) => {
  window.history.pushState({ load: view }, null, path);
};

window.onpopstate = function(event) {
  if (event.state) {
    state = event.state;
  }
  new Function(state.load)();
};

const search = () => {
  const handleSubmit = json => {
    if (d.querySelector("#main_container"))
      json.trainers.forEach(trainer =>
        Trainer.create(trainer).trainer(d.querySelector("#main_container"))
      );

    console.log(json);
  };
  new Fetch(
    null,
    "GET",
    BASE_URL + location.pathname + location.search,
    handleSubmit
  ).request();
};

function home() {
  new Home().controller.show()
}

function trainers(path) {
  const handleSubmit = json => {
    const trainer = Trainer.create(json);
    trainer.controller.show();
    Render.hideSpinner(main);
  };
  new Fetch(null, "GET", TRAINERS_URL + "/" + path, handleSubmit).request();
}

function users(path) {
  const handleSubmit = json => {
    const user = User.create(json);
    console.log(user);
    Render.hideSpinner(main);
    user.show();
  };
  new Fetch(null, "GET", USERS_URL + "/" + path, handleSubmit).request();
}

const pathName = [
  location.pathname.split("/")[1],
  location.pathname.split("/")[2]
];

let routes = {
  search: "search()",
  trainers: `trainers("${pathName[1]}")`,
  users: `users("${pathName[1]}")`,
  home: `home()`
};

const loadUrl = () => {
  if (routes[pathName[0]]) {
    new Function(routes[pathName[0]])();
  }
};
