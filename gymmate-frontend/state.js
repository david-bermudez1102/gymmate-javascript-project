let state = { load: null };

(function() {
  window.history.replaceState(state, null, "");
})();

const setState = (handler, path) => {
  state.load = `${handler}`;
  window.history.pushState(state, null, path);
  handler();
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

function showTrainers(path) {
  const handleSubmit = json => {
    const trainer = Trainer.create(json);
    console.log(trainer);
    Render.hideSpinner(main);
    trainer.show();
  };
  new Fetch(null, "GET", TRAINERS_URL + "/" + path, handleSubmit).request();
}

const pathName = [
  location.pathname.split("/")[1],
  location.pathname.split("/")[2]
];

let routes = {
  search: "search()",
  trainers: `showTrainers("${pathName[1]}")`
};

const loadUrl = () => {
  if (routes[pathName[0]]) {
    new Function(routes[pathName[0]])();
  }
};