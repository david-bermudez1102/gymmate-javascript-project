class AccountsController < ApplicationController

  def index
    accounts = Account.all
    render json: accounts
  end

  def show
    account = Account.find_by(id: params[:id])
    render json: account
  end

  private
    def trainer_params
      params.require(:account).permit(:name,:lastname,:username,:email,:date_of_birth, :sex, :password)
    end
end
