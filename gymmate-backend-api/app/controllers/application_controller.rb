class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :require_login!

  def user_signed_in?
    current_user.present?
  end

  def require_login!
    return true if authenticate_token
    render json: { errors: [ { detail: "Access denied" } ] }, status: 401
  end

  def current_user
    @_current_user ||= authenticate_token
  end

  private
    def authenticate_token
      authenticate_with_http_token do |token, options|
        Account.find_by(auth_token: token)
      end
    end
end
