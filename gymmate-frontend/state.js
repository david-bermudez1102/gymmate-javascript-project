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
    new Search().controller.createSearch(json);
  };
  new Fetch(
    null,
    "GET",
    BASE_URL + location.pathname + location.search,
    handleSubmit
  ).request();
};

function home() {
  new Home().controller.show();
}

function trainers(path) {
  const handleSubmit = json => {
    const trainer = Trainer.create(json);
    trainer.controller.show();
  };
  new Fetch(null, "GET", TRAINERS_URL + "/" + path, handleSubmit).request();
}

function fetchTrainer(trainerId) {
  return new Fetch(null, "GET", `${TRAINERS_URL}/${trainerId}`, trainer =>
    Trainer.create(trainer)
  ).request();
}

function exercises(path) {
  const handleSubmit = json => {
    fetchTrainer(json.program.trainer_id)
      .then(trainer =>
        trainer.programs.find(program => program.id === json.program.id)
      )
      .then(program =>
        program.exercises.find(exercise => exercise.id === json.id)
      )
      .then(exercise => exercise.render.show("#main_container"));
  };
  new Fetch(
    null,
    "GET",
    EXERCISES_URL + "/" + path,
    handleSubmit,
    d.querySelector("#main_container")
  ).request();
}

function routines(path) {
  if (path === "undefined") {
    Render.spinner(d.querySelector("main"));
    setTimeout(() => {
      new Home().render.show();
      currentUser.render.programs("#main_container");
      Render.hideSpinner(main);
    }, 50);
  } else {
    const handleSubmit = json => {
      fetchTrainer(json.trainer_id)
        .then(trainer =>
          trainer.programs.find(program => program.id === json.id)
        )
        .then(program => {
          new Home().render.show();
          program.render.show("#main_container");
        });
    };
    new Fetch(
      null,
      "GET",
      PROGRAMS_URL + "/" + path,
      handleSubmit,
      d.querySelector("#main_container")
    ).request();
  }
}

function users(path) {
  const handleSubmit = json => {
    const user = User.create(json);
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
  home: `home()`,
  exercises: `exercises("${pathName[1]}")`,
  routines: `routines("${pathName[1]}")`
};

const loadUrl = () => {
  if (routes[pathName[0]]) {
    new Function(routes[pathName[0]])();
  }
};
