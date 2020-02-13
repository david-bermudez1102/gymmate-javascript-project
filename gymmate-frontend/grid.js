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
            class:
              "text-left p-3 p-sm-5 rounded shadow banner header-banner-1 h-100"
          },
          null,
          Article.new(
            "Create Routines",
            "When people tell me they can't afford to join a gym, I tell them to go outside; planet Earth is a gym and we're already members. Run, climb, sweat, and enjoy all of the natural wonders that are available to you.",
            "Steve Maraboli"
          )
        )
      ),
      Column.new(
        Elem.section(
          {
            class:
              "text-left p-3 p-sm-5 rounded shadow banner header-banner-2 h-100"
          },
          null,
          Article.new(
            "Train like a pro",
            "Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside and something else will take its place. If you quit, however, it lasts forever.",
            "Lance Armstrong"
          )
        )
      ),
      Column.new(
        Elem.section(
          {
            class: "text-left p-3 p-sm-5 rounded shadow banner header-banner-3 h-100"
          },
          null,
          Article.new(
            "Track your workouts",
            "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.",
            "Arnold Schwarzenegger"
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
