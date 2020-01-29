class AccountsController < ApplicationController

  skip_before_action :require_login!, only: [:create]

  def index
    trainers = Trainer.all
    render json: trainers
  end

  def show
    trainer = Account.find_by(auth_token: params[:id])
    render json: trainer
  end

  private
    def trainer_params
      params.require(:account).permit(:name,:lastname,:username,:email,:password)
    end
end
