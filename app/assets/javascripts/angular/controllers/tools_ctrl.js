App.controller('ToolsCtrl', ['$scope', '$http', '$location', '$routeParams', function($scope, $http, $location, $routeParams){
    $scope.search_fb_like = function(id, index){
        url = $location.absUrl() 
        url = url.split("/tools")
        root = url[0]
        url = root + '/connections?page_id=' + $scope.fb_page_id;

        $scope.throbber_action(true, "Connecting to Facebook Page");
        $.ajax({ url: url, 
            success: function(data) { 
                $scope.$apply(function(){
                    $scope.social_data = data;
                    $scope.throbber_action(false, "Connecting to Facebook Page");
                })
            } 
        });
    }

    $scope.throbber_action = function(action, text){
    	if(action == true){
			$scope.modal_text = text;
			$('#throbber').modal('show')
			$scope.ellipseLoop = setInterval(function(){$scope.setEllipse()},250);
    	} else {
            $('#throbber').modal('hide');
    	}
    }

	$scope.setEllipse = function(){
		if(document.getElementById('ellipse').innerHTML == ""){
			document.getElementById('ellipse').innerHTML = '.';
		} else if(document.getElementById('ellipse').innerHTML == "."){
			document.getElementById('ellipse').innerHTML = '..';
		} else if(document.getElementById('ellipse').innerHTML == ".."){
			document.getElementById('ellipse').innerHTML = '...';
		} else if(document.getElementById('ellipse').innerHTML == "..."){
			document.getElementById('ellipse').innerHTML = '';
		}
		
	}

	$scope.login_fb = function(){
		// https://gist.github.com/ecin/2473860
		var page = require('webpage').create();
		page.open("http://www.facebook.com/login.php", function(status) {

		  if (status === "success") {
		    page.onConsoleMessage = function(msg, lineNum, sourceId) {
		      console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
		    };
		    page.evaluate(function() {
		      console.log('hello');
		      document.getElementById("email").value = "email";
		      document.getElementById("pass").value = "password";
		      document.getElementById("u_0_1").click();
		      // page is redirecting.
		    });
		    setTimeout(function() {
		      page.evaluate(function() {
		        console.log('haha');
		      });
		      page.render("page.png");
		      phantom.exit();
		    }, 5000);
		  }
		});
	}

	$scope.social_data = [];
	$scope.search_fb_users = function(){
		var id = 13927149;
		for (i=0; i<200; i++){
			url = "https://api.facebook.com/method/fql.query?query=select name from user where uid='" + (id + i) + "'&format=json";
			$.ajax({ url: url, 
				success: function(data) { 
					$scope.$apply(function(){
						$scope.social_data.push(data[0].name);
					})
				} 
			});
		}
	}
	

}]);

