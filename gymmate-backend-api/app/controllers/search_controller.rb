class SearchController < ApplicationController

  def index
    if params[:query] && !params[:query].empty?
      account = Account.search(params[:query])
      render json: account
    end
  end
end
