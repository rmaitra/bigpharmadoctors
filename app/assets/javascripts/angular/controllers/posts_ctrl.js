App.controller('PostsCtrl', ['$scope', '$location', 'Post', 'User', function($scope, $location, Post, User, $routeParams){
    $scope.new_post = null;
    $scope.table_page_num = 1;
    $scope.table_objs_current = [];
    $scope.table_page_count = 1;
    $scope.table_page_size = 5;
    $scope.showPost = false;
    if (document.getElementById('div-current-user') !== undefined){
        var div = document.getElementById('div-current-user');
        $scope.current_user = {
            id: div.getAttribute("data-user-id"),
            name: div.getAttribute("data-user-name"),
            email: div.getAttribute("data-user-email")
        }
        console.log($scope.current_user);
    }
    
    $scope.get_user_for_post = function(id){
        for(i in $scope.users){
            if ($scope.users[i].id === id){
                return $scope.users[i];
                
            }
        }
    }

    $scope.get_users = function(){
        //$scope.posts = Post.query();
        User.query({}, function success(results){
                $scope.users = results;
                $scope.users.sort(function(a, b){
                    return a.id-b.id;
                });
                console.log($scope.users.length);
                $scope.get_posts();
            }
        );   
    }
    $scope.get_users();

    $scope.get_posts = function(){
        //$scope.posts = Post.query();
        Post.query({}, function success(results){
                $scope.posts = results;
                for (i in $scope.posts){
                    for(j in $scope.users){
                        if ($scope.users[j].id === $scope.posts[i].user_id){
                            $scope.posts[i].userEmail = $scope.users[j].email;
                            $scope.posts[i].userName = $scope.users[j].name;
                            $scope.posts[i].userId = $scope.users[j].id;
                        }
                    }
                }
                //console.log($scope.posts);
                
            }
        );       
    }
    
    
    $scope.save_post = function(){
        Post.save({name: $scope.new_post}, function(){
            console.log('success');
        });
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
    
    $scope.$watch('posts',function() {
        if ($scope.posts == null) {
            return;
        }
        $scope.table_page_count = Math.ceil($scope.posts.length / $scope.table_page_size);
        var start = ($scope.table_page_num-1) * $scope.table_page_size;
        var end = start + $scope.table_page_size;
        $scope.table_objs_current = $scope.posts.slice(start,end);
     });

    $scope.set_page = function(pageNum) {
        $scope.table_page_num = pageNum;
        var start = ($scope.table_page_num-1) * $scope.table_page_size;
        var end = start + $scope.table_page_size;
        $scope.table_objs_current = $scope.posts.slice(start,end);
    }
  
}]);