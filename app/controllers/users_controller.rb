class UsersController < ApplicationController
  before_filter :require_staff, except: [ :create, :login, :logout ]

  def create
    user = User.create(
      first_name: params[:first_name],
      last_name: params[:last_name],
      email: params[:email]
    )

    if user
      render text: "Thanks #{user.first_name}! We're looking forward to seeing you out at our next trial event!!!"
    else
      render json: user.errors.full_messages.to_json, status: 406
    end
  end

  def index
    render json: User.all.to_json
  end

  def login
    user =
      User.find_by_id(session[:user_id]) ||
      User.find_by_email(params[:email]).try(:authenticate, params[:password])

    if user
      session[:user_id] ||= user.id
      user.update(last_login: Time.now) if (Time.now.to_i - user.last_login.to_i) > 1.hour
      render json: user.to_json
    else
      render json: nil
    end
  end

  def logout
    session.delete(:user_id)
    render json: nil
  end

  def update
    user = User.find(params[:id])
    if user.update_attributes(params.require(:user).permit(:valid_email))
      render json: user.to_json
    else
      render json: user.errors.full_messages.to_json, status: 406
    end
  end

  def destroy
    User.find(params[:id]).destroy
    render json: nil
  end
end