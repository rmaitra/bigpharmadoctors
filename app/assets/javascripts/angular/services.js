app.factory('User', ['$resource', function($resource) {
    
    return $resource('/users/:id', {}, {
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
