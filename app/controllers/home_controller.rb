class HomeController < ApplicationController
    include ApplicationHelper
    #before_action :signed_in_user, only: [:posting_board]
    
    def index
        @payments = get_payments
        @sum = 0
        @payments.each do |i|
            @sum = @sum + i[3].to_f
        end
    end

    def posting_board
        
    end

    def about
    end

    def join
    end
    
    private
    
        def authenticate_user!
            redirect_to root_path, notice: "You must login" unless user_signed_in?
        end
end
