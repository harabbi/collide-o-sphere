class User < ActiveRecord::Base
  has_secure_password validations: false

  validates_presence_of :email, :first_name, :last_name

  def last_login
    time = read_attribute(:last_login)
    if time.nil?
      'Never'
    elsif time.today?
      'Today'
    elsif (Time.now.beginning_of_day - 1.day) < time
      'Yesterday'
    else
      time.strftime("%b %e, '%y")
    end
  end
end