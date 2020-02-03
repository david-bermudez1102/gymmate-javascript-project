class SessionsController < ApplicationController

  def create
    account = Account.find_by(email: session_params[:email])
      if account.authenticate(session_params[:password])
        auth_token = account.generate_auth_token
        render json: {auth_token:auth_token, userable_id:account.userable_id, userable_type:account.userable_type}
      end
  end

  def show
    render json: current_user
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
