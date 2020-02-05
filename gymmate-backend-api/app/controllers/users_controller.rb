class UsersController < ApplicationController
  def create
    user = User.new
    account = user.build_account(account_params)
    
    if account.save
      account.generate_auth_token
      render json: account
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
