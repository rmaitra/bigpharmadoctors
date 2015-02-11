module ApplicationHelper
    require 'net/http'
    require 'net/https'
    require 'open-uri'
    require 'nokogiri'
    require 'json'
    require 'selenium-webdriver'
    require 'headless'
    require 'csv'

    def get_payments
        path = "#{Rails.root}/app/assets/totals_with_address.csv"
        array = Array.new
        CSV.foreach(path) do |row|
            array.push(row)
        end
        array = array.sort {|a,b| b[3].to_i <=> a[3].to_i}
        response = Array.new
        array.each_with_index do |i,index|
            i.push(index + 1)
            response.push(i)
            if (index + 1) == 100
                break
            end
        end
        return response
    end

    def get_payments_by_user(id)
        uri = URI('https://openpaymentsdata.cms.gov/resource/identified-general-payments-2013.json?physician_profile_id=' + id)
        response = send_request(uri)
        return JSON.parse(response)
    end

    def get_payments_by_state(state)
        uri = URI('https://openpaymentsdata.cms.gov/resource/identified-general-payments-2013.json?recipient_state=' + state)
        response = send_request(uri)
        return JSON.parse(response)
    end

    def send_request(uri)
        http = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl = true
        http.verify_mode = OpenSSL::SSL::VERIFY_PEER

        request = Net::HTTP::Get.new(uri.request_uri)
        request.add_field('X-App-Token', '1ni12XbYDjzkjdoJ7XI9gqBZ2')

        response = http.request(request)
        return response.body
    end

    def sum_pay(obj)
        sum = 0
        obj.each do |i|
            sum = sum + i['total_amount_of_payment_usdollars'].to_f
        end
        return sum
    end

    def find_rank(id)
        payments = get_payments
        payments.each_with_index do |row, index|
            if id == row[0]
                return index + 1
            end
        end
    end 
    
    def sortable(column, title = nil)  
        title ||= column.titleize  
        direction = (column == params[:sort] && params[:direction] == "asc") ? "desc" : "asc"  
        link_to title, :sort => column, :direction => direction  
    end 

    def sorting(array, column)
        if column == "City"
            column = 5
        end
        if sort_direction == "asc"
            array = array.sort {|a,b| b[column.to_i] <=> a[column.to_i]}
        else
            array = array.sort {|a,b| a[column.to_i] <=> b[column.to_i]}
        end
        return array
    end

end
