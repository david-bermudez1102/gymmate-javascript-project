class TrainersController < ApplicationController

  def create
    trainer = Trainer.new
    account = trainer.build_account(account_params)

    if account.save
       auth_token = account.generate_auth_token
       render json: {auth_token:auth_token, userable_id:account.userable_id, userable_type:account.userable_type}
    else
       render json: {errors: account.errors.full_messages}
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
      params.require(:account).permit(:name,:lastname,:username,:email,:date_of_birth, :sex,:password)
    end
end
