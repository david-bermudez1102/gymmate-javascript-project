class TrainersController < ApplicationController

  skip_before_action :require_login!, only: [:create]

  def create
    trainer = Trainer.new
    account = trainer.build_account(account_params)

    if trainer.save
       account.generate_auth_token
       render json: account
    end
  end

  def index
    trainers = Trainer.all
    render json: trainers
  end

  def show
    trainer = Trainer.find_by(id: params[:id])
    render json: trainer
  end

  private
    def account_params
      params.require(:account).permit(:name,:lastname,:username,:email,:password)
    end
end
