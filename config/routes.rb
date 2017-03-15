App::Application.routes.draw do

  get "home/index"

  # home routes
  root to: "home#index"

  get '/home/congress'
  match '/congress',  to: 'home#congress',            via: 'get'

  get '/home/physician(.:format)'
  match '/physician',  to: 'home#physician',            via: 'get'

end
