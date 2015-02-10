class ConnectionsController < ApplicationController
	include ApplicationHelper
	before_action :authenticate_user! #, only: [:index]

	def index
		page_id = params[:page_id]
		users = fb_connect_page(page_id)
		render json: users 
	end 

	def tools
		
	end 

	private
    
	    def authenticate_user!
		    redirect_to root_path, notice: "You must login" unless user_signed_in?
		end
end
