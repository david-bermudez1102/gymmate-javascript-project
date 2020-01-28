class SessionsController < ApplicationController
  skip_before_action :require_login!, only: [:create]

  def create
    account = Account.find_by(email: params[:account][:email])
      if account.authenticate(params[:acount][:password])
        auth_token = account.generate_auth_token
        render json: { auth_token: auth_token }
      end
  end

  def destroy
    account = current_user
    account.invalidate_auth_token
    head :ok
  end

end
