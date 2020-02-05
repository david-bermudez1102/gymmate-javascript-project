class UsersController < ApplicationController
  def create
    user = User.new
    account = user.build_account(account_params)
    
    if account.save
       auth_token = account.generate_auth_token
       render json: {auth_token:auth_token, userable_id:account.userable_id, userable_type:account.userable_type}
    end
  end

  def index
    users = User.all
    render json: users
  end

  def show
    user = User.find_by(id: params[:id])
    render json: user
  end

  private
    def account_params
      params.require(:account).permit(:name,:lastname,:username,:email,:password)
    end
end
