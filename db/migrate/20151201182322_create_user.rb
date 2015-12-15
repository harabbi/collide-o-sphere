class CreateUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :password_digest
      t.boolean :valid_email, default: false
      t.boolean :is_staff, default: false
      t.datetime :last_login
    end
  end
end
