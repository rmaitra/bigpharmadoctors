App.controller('ProfileCtrl', ['$scope', '$location', 'Post', 'User', function($scope, $location, Post, User, $routeParams){
    $scope.new_post = null;
    $scope.table_page_num = 1;
    $scope.table_objs_current = [];
    $scope.table_page_count = 1;
    $scope.table_page_size = 5;
    $scope.showPost = false;
    
    $scope.init = function(id)
    {
        $scope.user = {id: id};
        $scope.posts_for_user($scope.user.id);
    }
 
    
    if (document.getElementById('div-current-user') !== undefined){
        var div = document.getElementById('div-current-user');
        $scope.current_user = {
            id: div.getAttribute("data-user-id"),
            name: div.getAttribute("data-user-name"),
            email: div.getAttribute("data-user-email")
        }
        console.log($scope.current_user);
    }
    
    $scope.posts_for_user= function(id){
        Post.query({user_id:id}, 
            function success(results){
                $scope.posts = results;
                Post.query({num_posts_for_user:id}, function success(results){
                        console.log('got count');
                        console.log(results[0]);
                    }
                ); 
            }
        );
    }
    
    $scope.viewPost = function(post){
        $scope.post = post;
        $scope.showPost = true;
    }
    
    $scope.closePost = function(){
        $scope.post = null;
        $scope.showPost = false;
    }


    $scope.destroy = function(index){
        Post.remove({id: $scope.posts[index].id}, function(){
            $scope.posts.splice(index, 1);
        });
    }

    
    
    
       
    
    
}]);