class CreateFaq < ActiveRecord::Migration
  def change
    create_table :faqs do |t|
      t.string :question
      t.string :answer
      t.boolean :approved, default: false
      t.integer :score, default: 0
    end
  end
end
