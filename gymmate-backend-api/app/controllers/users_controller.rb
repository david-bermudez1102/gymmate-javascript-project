class UsersController < ApplicationController
  
  skip_before_action :require_login!, only: [:create]

  def create
    user = User.new
    account = user.build_account(trainer_params)
    if user.save
      account.generate_auth_token
      render json: user
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
    def trainer_params
      params.require(:account).permit(:name,:lastname,:username,:email,:password)
    end
end
