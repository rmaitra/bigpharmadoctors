App.factory('Post', ['$resource', function($resource) {
    return $resource('/posts/:id', {}, {
      show: {
        method: "GET"
      },
      
      remove: { 
        method: 'DELETE' 
      },
      
      update: {
        method: "PUT"
      },
      
      save: { 
        method: 'POST' 
      },
      
    });
}]);