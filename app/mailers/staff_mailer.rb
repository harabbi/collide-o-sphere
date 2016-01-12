class StaffMailer < ApplicationMailer
  def booking_request_email(booking_id)
    mail(to: User.select('email').where(is_staff: true).map(&:email), subject: 'New Booking Requested for Collide-O-Sphere')
  end
end
