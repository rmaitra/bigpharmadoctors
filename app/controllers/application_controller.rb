class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
    protect_from_forgery with: :exception
    #after_filter :set_csrf_cookie_for_ng
    #before_action :authenticate_user!

    before_filter :configure_permitted_parameters, if: :devise_controller?

    def configure_permitted_parameters
        devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:name, :email, :password, :password_confirmation) }
    end
    #before_filter :authenticate
    #include SessionsHelper
    #helper_method :logged_in?
  
    def logged_in?
        session[:login]
    end

    def after_sign_in_path_for(resource_or_scope)
        user_path
    end
    
    
    def set_csrf_cookie_for_ng
      cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
    end

    private
        def authenticate
          login = authenticate_or_request_with_http_basic do |username, password|
            username == "nextlist" && password == "nextspace"
          end
          session[:login] = login
        end

        def do_logout
          session[:login] = nil
        end
    
    def verified_request?
      super || form_authenticity_token == request.headers['X-XSRF-TOKEN']
    end
end
