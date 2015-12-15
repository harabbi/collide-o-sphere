class PlacesController < ApplicationController
  before_filter :require_staff, except: [:index, :create]

  def index
    places = Place.all
    places = places.where(pending: false) if params[:pending] == 'false'
    render json: places.to_json
  end

  def create
    place = Place.new(params.permit(:place_id, :name, :address, :lat, :lon))
    if place.save
      render json: place.to_json
    else
      render json: place.errors.full_messages.to_json, status: 406
    end
  end

  def update
    place = Place.find(params[:id])
    if place.update_attributes(params.require(:place).permit(:pending))
      render json: place.to_json
    else
      render json: place.errors.full_messages.to_json, status: 406
    end
  end

  def destroy
    Place.find(params[:id]).destroy
    render json: nil
  end
end