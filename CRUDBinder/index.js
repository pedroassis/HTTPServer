

function CRUDBinder(){

	var MediaType    = require("../MediaType");

	var HTTPMethods  = require("../HTTPMethods");

	var crudBinds    = [];
	
	crudBinds.update 	= HTTPMethods.PUT;
	crudBinds.save   	= HTTPMethods.POST;
	crudBinds.get    	= HTTPMethods.GET;
	crudBinds.getById	= HTTPMethods.GET;
	crudBinds.delete 	= HTTPMethods.DELETE;

	var params = [];

	params.getById = true;

	this.bind = function(object, callback){
		if(!object.url){
			throw new Error("Tipo invalido");
		}

		Object.keys(object).forEach(function(key){
			if(crudBinds[key]){
				var listener = function(){
					var length = object[key].length;
					if(length >= 2){
						return function(a, b, c){ return object[key](a, b, c); }
					}
					else if(length === 1)
						return function(a){ return object[key](a); }
					else 
						return function(){ return object[key](); }
				}();

				var url = object.url + (params[key] ? '/:param' : '');
				callback(url, listener, {
					type  : crudBinds[key],
					media : MediaType.JSON
				});
			}
		});
	};
}

module.exports = CRUDBinder;