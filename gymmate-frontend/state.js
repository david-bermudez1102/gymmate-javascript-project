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
  (new Function(state.load))();
};