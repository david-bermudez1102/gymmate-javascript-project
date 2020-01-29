class SessionsController < ApplicationController
  skip_before_action :require_login!, only: [:create]

  def create
    account = Account.find_by(email: session_params[:email])
      if account.authenticate(session_params[:password])
        auth_token = account.generate_auth_token
        render json: account
      end
  end

  def destroy
    account = current_user
    account.invalidate_auth_token
    render json: {message: "success"}
  end

  private
    def session_params
      params.require(:account).permit(:email,:password)
    end
end
