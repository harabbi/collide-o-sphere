class RequestsController < ApplicationController
  before_filter :require_staff, except: [:create]

  def index
    render json: nil
  end

  def create
    render json: 'This feature is under development!!!!', status: 406
  end
end