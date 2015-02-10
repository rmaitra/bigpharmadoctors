App.controller('UsersCtrl', ['$scope', '$location', 'User', function($scope, $location, User, $routeParams){
    $scope.new_user = null;
    if (document.getElementById('div-current-user') !== undefined){
        var div = document.getElementById('div-current-user');
        $scope.current_user = {
            id: div.getAttribute("data-user-id"),
            name: div.getAttribute("data-user-name"),
            email: div.getAttribute("data-user-email")
        }
    }
    //$scope.users = User.query();

    User.query({}, 
        function success(results){
            console.log(results);
            $scope.users = results.sort(function(a, b) { 
                var nameA = a.name.toLowerCase()
                var nameB = b.name.toLowerCase()
                if (nameA < nameB){ //sort string ascending
                    return -1
                }
                if (nameA > nameB){
                    return 1
                }
                return 0 //default return value (no sorting)
            })
            //$scope.users = results;
            
        },
        function error(){
            console.log('error');
        }
    ); 
     
    /*User.get_current_user({}, function success(results){
               console.log(results);
            },
            function error(){
               console.log('error');
            }
        );*/ 
    
    $scope.save_user = function(){
        User.save({name: $scope.new_user}, function(){
            console.log('success');
        });
    }

    $scope.viewUser = function(id){
    }
    
    $scope.editUser = function(id){
            
    }

    $scope.destroy = function(index){
        User.remove({id: $scope.users[index].id}, function(){
            $scope.users.splice(index, 1);
        });
    }
  
}]);

