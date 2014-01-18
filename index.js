

function HTTPServer(port, host){

	var express 			= require('express');

	var server = express();

	server.use(express.compress());
	server.use(express.bodyParser());
	
	server.all('*', function(req, res, next){
		req.setTimeout(120000);
		if (!req.get('Origin')) return next();
		// use "*" here to accept any origin
		console.log(req.get('Origin'));
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
		// res.set('Access-Control-Allow-Max-Age', 3600);
		if ('OPTIONS' == req.method) return res.send(200);
		next();
	});

	server.all('*', function(req, res, next){
		req.setTimeout(120000);
		if (!req.get('Origin')) return next();
		// use "*" here to accept any origin
		console.log(req.get('Origin'));
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
		res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
		// res.set('Access-Control-Allow-Max-Age', 3600);
		if ('OPTIONS' == req.method) return res.send(200);
		next();
	});
	var methodTypes = {
		GET 		: "get",
		POST 		: "post", 
		PUT 		: "put", 
		DELETE 		: "delete", 
		HEAD 		: "head", 
		OPTIONS 	: "options"
	};

	var errorListeners = {};

	var crudBinds = [];
	crudBinds.update = methodTypes.PUT;
	crudBinds.save   = methodTypes.POST;
	crudBinds.get    = methodTypes.GET;
	crudBinds.delete = methodTypes.DELETE;

	errorListeners['*'] = [];

	Object.keys(methodTypes).forEach(function(method){
		errorListeners[method] 		 = [];
		this[method] 		   		 = method;
		HTTPServer.prototype[method] = method;
	}.bind(this));

	Object.keys(this.MediaType).forEach(function(media){
		this[media] 		   = media;
		Object.keys(errorListeners).forEach(function(errorListener){
			errorListeners[errorListener][media] = [];
			errorListeners[errorListener]['*']   = [];
		});
	}.bind(this));

	function bindCallbacks(promise, options, request, response){

    	promise = promise.then(function(data){
    		response.send(data);
    	})

    	.then(null, function(error){

    		var httpCode = 401;

    		var body = error.message;

			var errorLs = Object.keys(errorListeners).filter(function(errorListener){
	    		return errorListener[options.type] && errorListener[options.type][options.media] || errorListener['*'] && (errorListener['*']['*'] || errorListener['*'][options.media]);
	    	});

	    	errorLs.forEach(function(errorL){
	    		var responseModifier = errorL(error);
	    		for(var headerKey in responseModifier.headers){
	    			var header = responseModifier.headers[headerKey];
		    		response.setHeader(header.name, header.value);
	    		}
	    		httpCode 	= responseModifier.code || httpCode;
	    		body 		= responseModifier.body || body;
	    	});

	    	response.send(httpCode, body);

		});

    	promise.done ? promise.done() : promise.end();
	}

	function DefaultListeners(httpServer){

		this[methodTypes.GET] = {};

		this[methodTypes.GET][httpServer.JSON] = function(url, listener, options){
			console.log("binding url: " + url + ", method: " + options.type);
			server[methodTypes[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', httpServer.MediaType.JSON);

		    	var promise = listener();

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[methodTypes.POST] = {};

		this[methodTypes.POST][httpServer.JSON] = function(url, listener, options){
			console.log("binding url: " + url + ", method: " + options.type);
			server[methodTypes[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', httpServer.MediaType.JSON);

		    	var promise = listener(request.body);

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[methodTypes.PUT] = {};

		this[methodTypes.PUT][httpServer.JSON] = function(url, listener, options){
			console.log("binding url: " + url + ", method: " + options.type);
			server[methodTypes[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', httpServer.MediaType.JSON);

		    	var promise = listener(request.body);

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

	};

	var defaultListeners = new DefaultListeners(this);

	this.addHTTPListerner = function(url, listener, options){
		if(typeof listener !== 'function' && typeof options === 'function'){
			var aux  = listener; 
			listener = options;
			options  = aux;
		}
		
		if(typeof options === 'string'){
			options = {		type : options 		};
		}

		if(options && options.type && !methodTypes[options.type.toUpperCase()]){
			throw new Error("Tipo invalido " + options.type);
		}
		options = options === undefined ? {} : options;

		options.type = options.type === undefined ? methodTypes.GET : options.type.toUpperCase();

		options.media = options.media === undefined ? this.JSON : options.media;

		defaultListeners[methodTypes[options.type]][options.media](url, listener, options);
	};

	this.addErrorListerner = function(listener, options){
		if(options && options.type && !methodTypes[options.type]){
			throw new Error("Tipo invalido");
		}
		options = options === undefined ? {} : options;

		options.type  = options.type  === undefined ? '*' : options.type;
		options.media = options.media === undefined ? '*' : options.media;

		errorListeners[methodTypes[options.type]][options.media].push(listener);
	};

	this.start = function(){

		server.use(express.errorHandler());

		server.get("/", function(req, res){
			res.send("ok");
		})
		
		server.listen(port, host, function() {
		   console.log('%s: Node server started on %s:%d ...', Date(Date.now()),
		               host, port);
		});
	};


	this.addCRUD = function(object){
		if(!object.url){
			throw new Error("Tipo invalido");
		}

		Object.keys(object).forEach(function(key){
			if(crudBinds[key]){
				this.addHTTPListerner(object.url, object[key], {
					type  : crudBinds[key],
					media : this.JSON
				});
			}
		}.bind(this));
	};


}

HTTPServer.prototype.MediaType = {
	JSON 	: 'application/json',
	HTML 	: 'text/html',
	XML		: 'text/xml'
};

module.exports = HTTPServer;