class Faq < ActiveRecord::Base
  default_scope { order('score desc') }

  validates_presence_of :question

  validates :score, numericality: { greater_than_or_equal_to: 0 }
end