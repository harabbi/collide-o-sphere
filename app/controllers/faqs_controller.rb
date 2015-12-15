class FaqsController < ApplicationController
  before_filter :require_staff, except: [:index, :create]

  def index
    faqs = Faq.all
    faqs = faqs.where(approved: true) unless @current_user.try(:is_staff?)
    render json: faqs.to_json
  end

  def create
    faq = Faq.new(params.permit(:question))
    if faq.save
      render json: faq.to_json
    else
      render json: faq.errors.full_messages.to_json, status: 406
    end
  end

  def update
    faq = Faq.find(params[:id])
    if faq.update_attributes(params.require(:faq).permit(:question, :answer, :score, :approved))
      render json: faq.to_json
    else
      render json: faq.errors.full_messages.to_json, status: 406
    end
  end

  def destroy
    Faq.find(params[:id]).destroy
    render json: nil
  end
end