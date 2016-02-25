class StaffMailer < ApplicationMailer
  def booking_request_email(booking_id)
    @booking = Booking.find(booking_id)
    mail(to: User.select('email').where(is_staff: true).map(&:email), subject: 'New Booking Requested for Collide-O-Sphere for ' + @booking.rental_date.to_date.to_s)
  end

  def faq_added_email(faq_id)
    @faq = Faq.find(faq_id)
    mail(to: User.select('email').where(is_staff: true).map(&:email), subject: 'New Question Posted to the FAQ')
  end
end
