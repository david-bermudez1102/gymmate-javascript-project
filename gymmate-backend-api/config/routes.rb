Rails.application.routes.draw do
  get '/search', to: 'search#index', as: 'search'
  
  resources :trainers
  resources :likes
  resources :pictures
  resources :workouts
  resources :exercises
  resources :completes
  resources :programs
  resources :users
  resources :sessions, except: :show
  resources :accounts
  get 'sessions/:auth_token', to:'sessions#show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
