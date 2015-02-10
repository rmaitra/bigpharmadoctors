class UsersController < ApplicationController
    skip_before_filter :verify_authenticity_token  
    before_action :authenticate_user!, only: [:edit, :update, :users_index]
    before_action :correct_user, only: [:edit, :update]
    before_action :admin_user, only: :destroy
    #before_action :authenticate_user!
   
    def index
        render json: User.all
    end
    
    def users_index
        
    end
    
    def profile
        @user = User.find(params[:id])
        @posts = @user.posts.all
    end
    
    def show
        render json: User.find(params[:id])
    end
    
    def new
        @user = User.new
    end

    def edit
        @user = User.find(params[:id])
    end

    def create
        logger.debug user_params
        @user = User.new(user_params)    # Not the final implementation!

        if @user.save
            redirect_to signin_path
        else
            render 'new'
        end
    end
    
    def destroy
        @user = User.find(params[:id])
        @user.destroy

        respond_to do |format|
          format.html { redirect_to :root }
          format.json { render :nothing => true, :status => :ok }
        #      format.json { render :nothing => true, :status => :not_found }
        end
    end
    
    
    def User.encrypt(token)
        Digest::SHA1.hexdigest(token.to_s)
    end

  private
  
        def create_remember_token
          self.remember_token = User.encrypt(User.new_remember_token)
        end
      

        def user_params
          params.require(:user).permit(:name, :email, :password,
                                       :password_confirmation)
        end
    
        def authenticate_user!
            redirect_to root_path, notice: "You must login" unless user_signed_in?
        end
   
        def correct_user
          @user = User.find(params[:id])
          redirect_to(root_url) unless current_user?(@user) || current_user.admin? 
        end
        
        def admin_user
          redirect_to(root_url) unless current_user.admin?
        end

end
