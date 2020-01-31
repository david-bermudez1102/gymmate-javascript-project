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
        Section.new(
          Article.new(
            "Create Routines",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-1"
        )
      ),
      Column.new(
        Section.new(
          Article.new(
            "Article",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-2"
        )
      ),
      Column.new(
        Section.new(
          Article.new(
            "Article",
            "All the world's a stage, and all the men and women merely players.",
            "William Shakespeare, As You Like It"
          ),
          "banner header-banner-3"
        )
      )
    );
    return this.row;
  }

  loginRow() {
    this.row.append(
      Column.new(Section.new(Welcome.loginForm()), "col-md-4 mt-3 px-1"),
      Column.new(
        Welcome.card(
          "Login to retrieve your current workouts!",
          "card-tooltip banner login-banner"
        ),
        "col-md mt-4 mt-md-3 pl-1 pl-md-4 pr-1"
      )
    );
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
      Column.new(Section.new(Welcome.signUpMenu()), "col-md-4 mt-3 px-1")
    );
    return this.row;
  }

  newProgramRow() {
    this.row.append(
      Column.new(
        Section.new(currentUser.renderNewProgramForm()),
        "col-md-4 mt-3 px-1"
      )
    );
    return this.row;
  }
}
