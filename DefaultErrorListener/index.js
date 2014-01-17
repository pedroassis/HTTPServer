

function DefaultErrorListener(){

	var MediaType   		 = require("./MediaType");

	var HTTPMethods  		 = require("./HTTPMethods");

	var errorListeners 		 = {};

	errorListeners['*'] 	 = [];

	errorListeners['*']['*'] = [];

	Object.keys(HTTPMethods).forEach(function(method){

		errorListeners[method] 		  = [];
		errorListeners[method]['*']   = [];

		Object.keys(MediaType).forEach(function(media){
			errorListeners[method][media] = [];
		});

	});

}