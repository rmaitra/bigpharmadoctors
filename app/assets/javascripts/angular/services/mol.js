App.factory('Mol', ['$resource', function($resource) {
    /*function Mol() {
        this.service = $resource('api/mols/:id', {});
    };
    Mol.prototype.query = function() {
        return this.service.query();
    };
    Mol.prototype.all = function() {
        return this.service.query();
    };
    Mol.prototype.delete = function(id) {
        this.service.remove({id: id});
    };
    Mol.prototype.save = function(attr) {
        return this.service.save(attr);
    };
    return new Mol;
    */
    return $resource('/mols/:id', {}, {
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
