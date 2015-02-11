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
        return array
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

end
