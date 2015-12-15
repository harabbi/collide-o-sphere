class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  before_filter do
    @current_user ||= User.find_by_id(session[:user_id] || params[:user_id])
  end

  private
  def require_staff
    unless User.find_by_id(session[:user_id]).is_staff?
      render json: nil, status: 403
    end
  end
end
