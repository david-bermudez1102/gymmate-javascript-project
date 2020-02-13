class Grid {
  constructor() {
    this._row = Row.new();
  }

  get row() {
    return this._row;
  }

  headerRow() {
    this.row.append(
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow banner header-banner-1"
          },
          null,
          Article.new(
            "Create Routines",
            "Success isn’t always about greatness. It’s about consistency. Consistent hard work gains success. Greatness will come."
          )
        )
      ),
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow banner header-banner-2"
          },
          null,
          Article.new(
            "Train like a pro",
            "Of course it’s hard. It’s supposed to be hard. It it were easy, everybody would do it. Hard is what makes it great."
          )
        )
      ),
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow banner header-banner-3"
          },
          null,
          Article.new(
            "Track your workouts",
            "All the world's a stage, and all the men and women merely players."
          )
        )
      )
    );
    this.row.id = "header_row";
    return this.row;
  }

  loginRow() {
    this.row.append(
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow "
          },
          null,
          Welcome.loginForm()
        ),
        "col-md-4 mt-3 px-1"
      ),
      Column.new(
        Welcome.card(
          "Login to retrieve your current workouts!",
          "card-tooltip banner login-banner"
        ),
        "col-md mt-4 mt-md-3 pl-1 pl-md-4 pr-1"
      )
    );
    this.row.id = "login_row";
    return this.row;
  }

  signupRow() {
    this.row.append(
      Column.new(
        Welcome.card(
          "It all starts here. Sign Up now",
          "inverse-card-tooltip banner signup-banner"
        ),
        "col-md mt-4 mt-md-3 pr-1 pr-md-4 pl-1"
      ),
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow "
          },
          null,
          Welcome.signUpMenu()
        ),
        "col-md-4 mt-3 px-1"
      )
    );
    this.row.id = "signup_row";
    return this.row;
  }
}
