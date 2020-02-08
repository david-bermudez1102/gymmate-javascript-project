class Element {
  static create(tagName, attributes, ...append) {
    const element = d.createElement(tagName);

    Object.keys(attributes).forEach(attribute =>
      element.setAttribute(attribute, attributes[attribute])
    );

    append.forEach(a => element.append(a));
    return element;
  }

  static handleOnclick(
    element,
    handleOnclick,
    preventDefault = true,
    stopPropagation = true
  ) {
    return element.addEventListener("click", e => {
      if (handleOnclick) handleOnclick();
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
    });
  }

  static handleOnsubmit(element, handleOnsubmit) {
    return element.addEventListener(
      "submit",
      e => {
        e.preventDefault();
        e.stopPropagation();
        if (!element.method === "GET") element.classList.add("was-validated");
        if (element.checkValidity() === true) {
          const formData = new FormData(element);
          if (element.method == "GET")
            action = action + `/?${new URLSearchParams(formData).toString()}`;
          if (element.method !== "GET") {
            new Fetch(
              formData,
              element.method,
              element.action,
              handleOnsubmit
            ).submit();
          } else {
            new Fetch(
              formData,
              element.method,
              element.action,
              handleOnsubmit
            ).request();
          }
          e.target.reset();
        }
      },
      false
    );
  }

  static div(attributes, handleOnclick, ...append) {
    const element = this.create("div", attributes, ...append);
    this.handleOnclick(element, handleOnclick);
    return element;
  }

  static span(attributes, handleOnclick, ...append) {
    const element = this.create("span", attributes, ...append);
    this.handleOnclick(element, handleOnclick);
    return element;
  }

  static button(attributes, handleOnclick, ...append) {
    const element = this.create("button", attributes, ...append);
    this.handleOnclick(element, handleOnclick);
    return element;
  }

  static icon(attributes, handleOnclick, ...append) {
    const element = this.create("i", attributes, ...append);
    return element;
  }

  static link(attributes, handleOnclick, ...append) {
    const element = this.create("a", attributes, ...append);

    if (!Object.keys(attributes).some(attribute => attribute === "href"))
      element.href = "#";

    this.handleOnclick(element, handleOnclick);
    return element;
  }

  static section(attributes, handleOnclick, ...append) {
    const element = this.create("section", attributes, ...append);
    this.handleOnclick(element, handleOnclick);
    return element;
  }

  static form(attributes, handleOnsubmit, ...append) {
    const element = this.create("form", attributes, ...append);
    this.handleOnsubmit(element, handleOnsubmit);
    return element;
  }

  static prompt(title, body, confirmBtnValue, dismissBtnValue) {
    return new DOMParser().parseFromString(
      `
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
            <p>${body}<p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" name="confirm" id="confirmBtnValue" data-dismiss="modal">
              ${confirmBtnValue}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal" onclick="d.querySelector('#myModal').remove()"
            >
              ${dismissBtnValue}
            </button>
          </div>
        </div>
      </div>
    </div>
    `,
      "text/html"
    ).body.firstChild;
  }
}
