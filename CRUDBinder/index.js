

function CRUDBinder(){

	var MediaType    = require("./MediaType");

	var HTTPMethods  = require("./HTTPMethods");

	var crudBinds    = [];
	
	crudBinds.update = HTTPMethods.PUT;
	crudBinds.save   = HTTPMethods.POST;
	crudBinds.get    = HTTPMethods.GET;
	crudBinds.delete = HTTPMethods.DELETE;

	this.bind = function(object, callback){
		if(!object.url){
			throw new Error("Tipo invalido");
		}

		Object.keys(object).forEach(function(key){
			if(crudBinds[key]){
				callback(object.url, object[key].bind(object), {
					type  : crudBinds[key],
					media : MediaType.JSON
				});
			}
		});
	};
}