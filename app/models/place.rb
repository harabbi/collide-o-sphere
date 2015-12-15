class Place < ActiveRecord::Base
  validates_uniqueness_of :place_id
  validates_presence_of :lat, :lon

  #validate that the coordinates are in a range of X miles?
end