module ApplicationHelper
    require 'net/http'
    require 'open-uri'
    require 'nokogiri'
    require 'json'
    require 'selenium-webdriver'
    require 'headless'
    require 'csv'

    def setup
      @headless = Headless.new
      @headless.start
      @driver = Selenium::WebDriver.for :firefox
      @usr = "rmaitra@slugmail.ucsc.edu"
      @pwd = "Rdmmpls1988!"
    end

    def teardown
      @driver.quit
      @headless.destroy
    end

    def run
      setup
      yield
      teardown
    end

    def fb_connect_page(page_id)
        run do
            @driver.get "http://www.facebook.org"

            wait = Selenium::WebDriver::Wait.new(:timeout => 10)
            wait.until{ @driver.title == "Welcome to Facebook - Log In, Sign Up or Learn More"}
            
            # login to facebook with test email and password
            elem = @driver.find_element(:id=> "email")
            elem.send_keys @usr
            elem = @driver.find_element(:id=> "pass")
            elem.send_keys @pwd
            elem.submit
            
            # wait for page to load
            puts @driver.title
            
            @driver.get "https://www.facebook.com/search/" + page_id + "/likers" #314851393446
            wait.until{ @driver.find_elements(:class => '_5d-5').length > 0 }
            
            # check how many users there are
            puts @driver.find_elements(:class => '_5d-5').length

            
            current_count = @driver.find_elements(:class, '_5d-5').length

            # Wait for the additional images to load
            while current_count < 5
                past_count = current_count

                # scroll to the last user on the page
                @driver.find_elements(:class => '_5d-5').last.location_once_scrolled_into_view
                until current_count < @driver.find_elements(:class, '_5d-5').length
                  sleep(1)
                end
                current_count = @driver.find_elements(:class, '_5d-5').length
                puts current_count
                puts past_count
                if past_count == current_count
                    puts 'break'
                    break
                end
            end

            # take users and return 
            elems = @driver.find_elements(:class=> "_5d-5")
            array = Array.new
            for i in elems
                array.push(i.text)
            end
            return array.to_json
             

            #wait.until { @driver.find_element(:xpath, "//button[@title='Play']").displayed?}
            #@driver.save_screenshot 'example2.png'
            #puts "Page title is #{@driver.title}"
            #@driver.manage.timeouts.page_load = 10
        end
    end


    def send_pdb_requests(string)
    	results = searchPDB(query_molecule_name(string))
    	results.concat(searchPDB(query_structure_description(string)))
    	results.concat(searchPDB(query_structure_title(string)))
    	results.concat(searchPDB(query_author(string)))
    	logger.debug results
    	return results.uniq
    end

    def query_molecule_name(string)
    	return '<orgPdbQuery>
		<queryType>org.pdb.query.simple.MoleculeNameQuery</queryType>
		<description>Molecule Name Search : Molecule Name='+string+'</description>
		<macromoleculeName>'+string+'</macromoleculeName>
		</orgPdbQuery>'	
    end

    def query_structure_description(string)
    	return '<orgPdbQuery>
				<queryType>org.pdb.query.simple.StructDescQuery</queryType>
				<description>StructDescQuery: entity.pdbx_description.comparator=contains entity.pdbx_description.value='+string+' </description>
				<entity.pdbx_description.comparator>contains</entity.pdbx_description.comparator>
				<entity.pdbx_description.value>'+string+'</entity.pdbx_description.value>
				</orgPdbQuery>'
    end

    def query_structure_title(string)
    	return  '<orgPdbQuery>
				<queryType>org.pdb.query.simple.StructTitleQuery</queryType>
				<description>StructTitleQuery: struct.title.comparator=contains struct.title.value='+string+' </description>
				<struct.title.comparator>contains</struct.title.comparator>
				<struct.title.value>'+string+'</struct.title.value>
				</orgPdbQuery>'
    end

    def query_author(string)
    	return  '<orgPdbQuery>
				  <queryType>org.pdb.query.simple.AdvancedAuthorQuery</queryType>
				  <description>Author Name: Search type is All Authors and Author is '+string+' and Exact match is false</description>
				    <searchType>All Authors</searchType>
				    <audit_author.name>'+string+'</audit_author.name>
				    <exactMatch>false</exactMatch>
				</orgPdbQuery>'
    end

    def send_abstract_request(target)
        page = Nokogiri::HTML(open(target))
        source = page.css("div.abstr div")
        logger.debug page.css("div.abstr div")
        #url = URI.parse(target)
        #source = Net::HTTP.get(url)
        #str = source.split('<div class="abstr"><h3>Abstract</h3><div class="">')
        #logger.debug str 
        return source
    end



	def searchPDB(query)
        url = URI.parse('http://www.rcsb.org/pdb/rest/search')
        request = Net::HTTP::Post.new(url.path)
        logger.debug('<?xml version="1.0" encoding="UTF-8"?>'+query)
        request.body = '<?xml version="1.0" encoding="UTF-8"?>'+query
        									

        response = Net::HTTP.start(url.host, url.port) {|http| http.request(request)}
        str = (response.body).split(/\r?\n/ ) 


        return str
    end

    def searchInfo
    	#url = URI.parse('http://www.rcsb.org/pdb/rest/describePDB?structureId=4hhb,1hhb')
        #request = Net::HTTP::Post.new(url.path)
        #response = Net::HTTP.start(url.host, url.port) {|http| http.request(request)}
        #str = (response.body).split(/\r?\n/ ) 

    end

    def get_payments
        path = "#{Rails.root}/app/assets/totals_with_address.csv"
        logger.debug path
        array = Array.new
        CSV.foreach(path) do |row|
            array.push(row)
        end
        array = array.sort {|a,b| b[3].to_i <=> a[3].to_i}
        return array
    end

end
