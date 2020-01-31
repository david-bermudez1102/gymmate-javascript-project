class AccountsController < ApplicationController

  def index
    accounts = Account.all
    render json: accounts
  end

  def show
    account = Account.find_by(auth_token: params[:auth_token])
    render json: account
  end

  private
    def trainer_params
      params.require(:account).permit(:name,:lastname,:username,:email,:password)
    end
end
