class CreatePlace < ActiveRecord::Migration
  def change
    create_table :places do |t|
      t.string :place_id
      t.string :name
      t.float :lat
      t.float :lon
      t.string :address
      t.string :url
      t.boolean :pending, default: true
    end
  end
end
