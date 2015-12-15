class PlacesController < ApplicationController
  def index
    render json: Place.all.to_json
  end

  def create
    place = Place.new(params.permit(:place_id, :name, :address, :lat, :lon))
    if place.save
      render json: place.to_json
    else
      render json: place.errors.to_json
    end
  end
end