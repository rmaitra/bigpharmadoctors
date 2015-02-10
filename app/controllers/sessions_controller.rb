class SessionsController < Devise::SessionsController
   after_filter :handle_failed_login, :only => :new

  def new
    super
  end

  def create
        self.resource = warden.authenticate!(auth_options)
        set_flash_message(:notice, :signed_in) if is_navigational_format?
        sign_in(resource_name, resource)
        if !session[:return_to].blank?
          redirect_to session[:return_to]
          session[:return_to] = nil
        else
          logger.debug "================================================"
          logger.debug resource
          @current_user = resource
          redirect_to profile_path(resource)
        end
  end

  def destroy
    sign_out
    redirect_to root_url
  end
  private
  def handle_failed_login
    if failed_login?
      render json: { success: false, errors: ["Login Credentials Failed"] }, status: 401
    end
  end 

  def failed_login?
    (options = env["warden.options"]) && options[:action] == "unauthenticated"
  end 
  
end
