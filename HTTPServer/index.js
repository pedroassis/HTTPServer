

function HTTPServer(server, port, host){

	var MediaType    = require("../MediaType");

	var HTTPMethods  = require("../HTTPMethods");

	var defaultListeners = server.getListenerBinder();

	function bindCallbacks(promise, options, request, response){

    	promise = promise.then(function(data){
    		response.send(data);
    	})

    	.then(null, function(error){

    		var httpCode = 401;

    		var body = typeof error === "string" ? error : error.message;

			// var errorLs = Object.keys(errorListeners).filter(function(errorListener){
	  //   		return errorListener[options.type] && errorListener[options.type][options.media] || errorListener['*'] && (errorListener['*']['*'] || errorListener['*'][options.media]);
	  //   	});

	  //   	errorLs.forEach(function(errorL){
	  //   		var responseModifier = errorL(error);
	  //   		for(var headerKey in responseModifier.headers){
	  //   			var header = responseModifier.headers[headerKey];
		 //    		response.setHeader(header.name, header.value);
	  //   		}
	  //   		httpCode 	= responseModifier.code || httpCode;
	  //   		body 		= responseModifier.body || body;
	  //   	});

	    	response.send(httpCode, body);

		});

    	promise.done ? promise.done() : promise.end();
	}


	function getValidOptions(listener, options){

		if(typeof listener !== 'function' && typeof options === 'function'){
			var aux  = listener; 
			listener = options;
			options  = aux;
		}
		
		if(typeof options === 'string'){
			options = {		type : options 		};
		}

		if(options && options.type && !HTTPMethods[options.type.toUpperCase()]){
			throw new Error("Tipo invalido " + options.type);
		}
		options = options === undefined ? {} : options;

		options.type = options.type === undefined ? HTTPMethods.GET : options.type.toUpperCase();

		options.media = options.media === undefined ? MediaType.JSON : options.media;

		return [listener, options];

	}

	this.addHTTPListerner = function(url, listener, options){
		var params = getValidOptions(listener, options);

		defaultListeners[HTTPMethods[params[1].type]][params[1].media](url, params[0], params[1], bindCallbacks);
	};

	this.addErrorListerner = function(url, listener, options){
		if(options && options.type && !HTTPMethods[options.type]){
			throw new Error("Tipo invalido");
		}
		options = options === undefined ? {} : options;

		options.type  = options.type  === undefined ? '*' : options.type;
		options.media = options.media === undefined ? '*' : options.media;

		errorListeners[HTTPMethods[options.type]][options.media].push(listener);
	};

	this.start = function(){
		
		server.listen(port, host, function() {
		   console.log('%s: Node server started on %s:%d ...', Date(Date.now()),
		               host, port);
		});
	};


	this.addCRUD = function(object, binder){

		binder.bind(object, this.addHTTPListerner.bind(this));

	};


}

module.exports = HTTPServer;