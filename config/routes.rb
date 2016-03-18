Rails.application.routes.draw do
  resources :places, only: [:create, :index, :update, :destroy]
  resources :faqs, only: [:create, :index, :update, :destroy]
  resources :users, only: [:create, :index, :update, :destroy] do
    post :login, on: :collection
    post :logout, on: :collection
  end
  resources :requests, only: [:create, :index]
end
