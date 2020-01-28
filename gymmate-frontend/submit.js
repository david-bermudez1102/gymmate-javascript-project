class Fetch {
  constructor(data, method, url, callback) {
    this._data = data;
    this._method = method;
    this._url = url;
    this._callback = callback;
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

  get callback(){
    return this._callback
  }

  get configObj() {
    return {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Authorization": `Token token=${sessionStorage.getItem("auth_token")}`
      },
      body: JSON.stringify(this.data)
    };
  }

  submit() {
    fetch(this.url, this.configObj)
      .then(this.parseJson)
      .then(this.callback);
  }

  request() {
    const token = sessionStorage.getItem("auth_token")
    const h = new Headers();
    h.append("Authorization", `Token token=${token}`);
    fetch(this.url, {headers: h})
      .then(this.parseJson)
      .then(this.callback);
  }

  parseJson(response) {
    return response.json();
  }
}
