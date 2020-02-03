Rails.application.routes.draw do
  resources :searches
  resources :trainers
  resources :likes
  resources :pictures
  resources :workouts
  resources :exercises
  resources :programs
  resources :users
  resources :sessions
  resources :accounts, except:[:show]
  get 'accounts/:auth_token', to:'accounts#show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
