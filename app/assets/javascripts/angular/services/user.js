App.factory('User', ['$resource', function($resource) {
    /*function User() {
        this.service = $resource('/api/users/:id', {id: '@id'});
    };
    User.prototype.all = function() {
        return this.service.query();
    };
    User.prototype.delete = function(id) {
        this.service.remove({id: id});
    };
    User.prototype.save = function(attr) {
        return this.service.save(attr);
    };
    return new User;*/
    
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
