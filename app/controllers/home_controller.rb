class HomeController < ApplicationController
    include ApplicationHelper
    #before_action :signed_in_user, only: [:posting_board]
    
    def index
        @payments = get_payments
        

        @top_ten = Array.new
        @payments.each_with_index do |i, index|
            @top_ten.push(i)
            if index + 1 == 10
                break
            end
        end

        @sum = 0
        @payments.each_with_index do |i,index|
            @sum = @sum + i[3].to_f
        end
        if params[:sort]
            @payments = sorting(@payments, params[:sort])
        end
    end

    def physician
        @doc = get_payments_by_user(params[:id])
        @rank = find_rank(params[:id])
        @name = @doc[0]['physician_first_name'].capitalize + " " +  @doc[0]['physician_last_name'].capitalize
        @address = @doc[0]['recipient_primary_business_street_address_line1'].split.map(&:capitalize).join(' ')
        if @doc[0]['recipient_primary_business_street_address_line2'] != nil
            @address + " " + @doc[0]['recipient_primary_business_street_address_line2'].split.map(&:capitalize).join(' ')
        end
        @city = @doc[0]['recipient_city']
        @state = @doc[0]['recipient_state']
        @zip = @doc[0]['recipient_zip_code']
        @sum = sum_pay(@doc)

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

        def sort_direction
            %w[asc desc].include?(params[:direction]) ? params[:direction] : "asc"
        end
end
