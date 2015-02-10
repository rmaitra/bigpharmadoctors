App.controller('IndexCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){

	

	$scope.fb_status = function(){

		FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
		    // the user is logged in and has authenticated your
		    // app, and response.authResponse supplies
		    // the user's ID, a valid access token, a signed
		    // request, and the time the access token 
		    // and signed request each expire
		    $scope.uid = response.authResponse.userID;
		    $scope.accessToken = response.authResponse.accessToken;
		    $scope.fb_login_status = true;
		  } else if (response.status === 'not_authorized') {
		    // the user is logged in to Facebook, 
		    // but has not authenticated your app
		  } else {
		    // the user isn't logged in to Facebook.
		  }
		 });
	}

	$scope.fb_info = function(){
		FB.api("/me", function(response){
			if (response && !response.error) {
				console.log(response)
			}
	    });
	}

	$scope.search_fb_like = function(){
		//var url = "/"+$scope.fb_user_id+"/likes/"+$scope.fb_page_id; 
		/*console.log(url);
		FB.api(url, function (response) {
			if (response && !response.error) {
				console.log(response);
			}
	    })*/
		


		
		//https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27http://stackoverflow.com/%27&format=json
	    /*FB.api(
		    "/search?q=Triporama&type=page",
		    function (response) {
		      if (response && !response.error) {
		        console.log(response)
		      }
		    }
		);

		FB.api(
		    "/search?q=Raj&type=user",
		    function (response) {
		      if (response && !response.error) {
		        console.log(response)
		      }
		    }
		);*/

		//SELECT uid, page_id FROM page_fan WHERE uid IN (SELECT uid2 FROM friend WHERE uid1 = me()) AND page_id = ' . $page_id
		//https://api.facebook.com/method/fql.query?query=select%20user_id%20from%20like%20where%20page_id=%27314851393446%27&format=json


		/*FB.api(
		    "/me/accounts",
		    function (response) {
		      if (response && !response.error) {
		        console.log(response)
		      }
		    }
		);*/
	}

	

    
}]);

