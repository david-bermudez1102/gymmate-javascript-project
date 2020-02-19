class Fetch {
  constructor(data, method, url, callback, target) {
    this._data = data;
    this._method = method;
    this._url = url;
    this._callback = callback;
    this._target = target;
  }

  get data() {
    return this._data;
  }

  get method() {
    return this._method;
  }

  get url() {
    return this._url;
  }

  get callback() {
    return this._callback;
  }

  get target() {
    return this._target;
  }

  get configObj() {
    return {
      method: this.method,
      headers: {
        Accept: "application/json",
        Authorization: `Token token=${sessionStorage.getItem("auth_token")}`
      },
      body: this.data
    };
  }

  submit() {
    Layout.spinner(main);
    return fetch(this.url, this.configObj)
      .then(this.parseJson)
      .then(json => {
        if (!json.errors) this.callback(json);
        else Layout.error(json, this.target);
      })
      .then(Layout.hideSpinner(main))
      .catch(console.log);
  }

  request() {
    const token = sessionStorage.getItem("auth_token");
    const h = new Headers();
    h.append("Authorization", `Token token=${token}`);
    Layout.spinner(main);
    return fetch(this.url, { headers: h })
      .then(this.parseJson)
      .then(this.callback)
      .then(result => {
        Layout.hideSpinner(main);
        return result
      })
      .catch(console.log);
  }

  parseJson(response) {
    return response.json();
  }
}
