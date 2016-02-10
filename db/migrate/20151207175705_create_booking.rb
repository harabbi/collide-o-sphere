class CreateBooking < ActiveRecord::Migration
  def change
    add_column :users, :phone_number, :string

    create_table :bookings do |t|
      t.integer :user_id
      t.string :status
      t.datetime :rental_date
      t.string :rental_size
      t.integer :num_guests
      t.string :event_type
      t.string :event_type_other
      t.integer :place_id
      t.string :place_other
      t.text :comments
    end
  end
end
