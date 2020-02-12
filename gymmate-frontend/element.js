class Elem {
  static create(tagName, attributes, ...append) {
    const elem = d.createElement(tagName);
    Object.keys(attributes).forEach(attribute => {
      elem.setAttribute(attribute, attributes[attribute]);
    });

    append.forEach(a => elem.append(a));
    return elem;
  }

  static handleOnclick(
    elem,
    handleOnclick,
    preventDefault = true,
    stopPropagation = true
  ) {
    return elem.addEventListener("click", e => {
      if (handleOnclick) handleOnclick();
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
    });
  }

  static handleOnsubmit(elem, method, handleOnsubmit) {
    return elem.addEventListener(
      "submit",
      e => {
        let action, target;

        e.preventDefault();
        e.stopPropagation();

        !elem.dataset.target ? (target = elem) : (target = elem.dataset.target);

        if (!method === "GET") elem.classList.add("was-validated");
        const formData = new FormData(elem);
        if (elem.checkValidity() === true) {
          method === "GET"
            ? (action =
                elem.action + `/?${new URLSearchParams(formData).toString()}`)
            : (action = elem.action);

          if (method !== "GET") {
            new Fetch(
              formData,
              method,
              action,
              handleOnsubmit,
              target
            ).submit();
          } else {
            new Fetch(
              formData,
              method,
              action,
              handleOnsubmit,
              target
            ).request();
          }
          if (method !== "GET") e.target.reset();
        }
      },
      false
    );
  }

  static label(attributes, handleOnclick, ...append) {
    const elem = this.create("label", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static input(attributes, handleOnclick, ...append) {
    const elem = this.create("input", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static h1(attributes, handleOnclick, ...append) {
    const elem = this.create("h1", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static h2(attributes, handleOnclick, ...append) {
    const elem = this.create("h2", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static h3(attributes, handleOnclick, ...append) {
    const elem = this.create("h3", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static textArea(attributes, handleOnclick, ...append) {
    const elem = this.create("textarea", attributes, ...append);
    this.handleOnclick(elem, handleOnclick);
    return elem;
  }

  static div(attributes, handleOnclick, ...append) {
    const elem = this.create("div", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static nav(attributes, handleOnclick, ...append) {
    const elem = this.create("nav", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static ul(attributes, handleOnclick, ...append) {
    const elem = this.create("ul", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static li(attributes, handleOnclick, ...append) {
    const elem = this.create("li", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static span(attributes, handleOnclick, ...append) {
    const elem = this.create("span", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static button(attributes, handleOnclick, ...append) {
    const elem = this.create("button", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false);
    return elem;
  }

  static icon(attributes, handleOnclick, ...append) {
    const elem = this.create("i", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static img(attributes, handleOnclick, ...append) {
    const elem = this.create("img", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static section(attributes, handleOnclick, ...append) {
    const elem = this.create("section", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static p(attributes, handleOnclick, ...append) {
    const elem = this.create("p", attributes, ...append);
    this.handleOnclick(elem, handleOnclick, false, false);
    return elem;
  }

  static form(attributes, handleOnsubmit, ...append) {
    const elem = this.create("form", attributes, ...append);
    this.handleOnsubmit(
      elem,
      attributes["method"],
      handleOnsubmit,
      false,
      false
    );

    return elem;
  }

  static link(attributes, handleOnclick, ...append) {
    const elem = this.create("a", attributes, ...append);

    if (!Object.keys(attributes).some(attribute => attribute === "href"))
      elem.href = "#";

    this.handleOnclick(elem, handleOnclick, true, false);
    return elem;
  }

  static video(url, className = "embed-responsive embed-responsive-16by9") {
    const video = d.createElement("video");
    const source = d.createElement("source");
    source.src = `${BASE_URL}${url}`;
    source.className = "embed-responsive-item";
    video.className = className;
    video.controls = true;
    video.append(source);
    return video;
  }

  static html(string) {
    return new DOMParser().parseFromString(string, "text/html").body.firstChild;
  }

  static prompt(title, body, confirmBtnValue, dismissBtnValue) {
    return this.html(`
      <div class="modal" id="myModal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>${body}</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                name="confirm"
                id="confirmBtnValue"
                data-dismiss="modal"
              >
                ${confirmBtnValue}
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
                onclick="d.querySelector('#myModal').remove()"
              >
                ${dismissBtnValue}
              </button>
            </div>
          </div>
        </div>
      </div>
    `);
  }
}
