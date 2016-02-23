class RequestsController < ApplicationController
  before_filter :require_staff, except: [:create]

  def index
    render json: nil
  end

  def create
    params[:phone] = ActionController::Base.helpers.number_to_phone(params[:phone], area_code: true)
    user = User.find_or_create_by(first_name: params[:first_name], last_name: params[:last_name], email: params[:email])
    user.update_attribute(:phone_number, params[:phone]) if user.phone_number.blank? or user.phone_number != params[:phone]

    begin
      booking = Booking.create(
        user: user,
        status: 'NEW',
        rental_date: Time.parse(params['rental_date'].to_s + params['rental_time'].to_s),
        rental_size: params['rental_size'],
        num_guests: params['num_guests'],
        event_type: params['event_type'],
        event_type_other: params['event_type'],
        place_other: params['place_other'],
        comments: params['comments']
      )

      if booking.persisted?
        StaffMailer.booking_request_email(booking.id).deliver_later
        render text: 'Your request has been submitted. Look for an email from us soon!'

      else
        render text: booking.errors.full_messages.join(', '), status: 406
      end

    rescue => exc
      render text: "Booking information incomplete: " + exc.message, status: 406
    end

  end

  def destroy

  end
end
