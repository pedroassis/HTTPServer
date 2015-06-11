

module.exports = ExpressAdapter;

function ExpressAdapter(){

	var Q 					= require('q');

	var express 			= require('express');

	var MediaType   		= require("../MediaType");

	var HTTPMethods  		= require("../HTTPMethods");

	var server 				= express();

	server.use(express.compress());
	server.use(express.json());
	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.session({secret: '25d5fc638ae445269d2b813d500767f0'}));

	server.use(express.errorHandler());

	this.getListenerBinder = function(){
		return defaultListeners;
	};

	this.addStaticFolder = function(folder){
		server.use(express.static(folder, { maxAge: 31622400000 }));
	};

	this.listen = server.listen.bind(server);

	var defaultListeners = new DefaultListeners();

	function DefaultListeners(){

		var bindedUrls = [];

		this[HTTPMethods.GET] = [];

		this[HTTPMethods.GET][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			bindedUrls.push(url);

			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);
		    	try {
		    		interceptors.forEach(function(interceptor){
		    			interceptor(request, response);
		    		});
		    	} catch(e){
		    		response.send(401, e.message);
		    		return;
		    	}

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.params ? request.params.param : undefined, request);
		    	} else {
		    		var deferred = Q.defer();
		    		listener(deferred, request);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[HTTPMethods.POST] = {};

		this[HTTPMethods.POST][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			bindedUrls.push(url);
			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);
		    	try {
		    		interceptors.forEach(function(interceptor){
		    			interceptor(request, response);
		    		});
		    	} catch(e){
		    		response.send(401, e.message);
		    		return;
		    	}

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.body, request);
		    	} else {
		    		var deferred = Q.defer();
		    		var returned = listener(request.body, deferred, request);
		    		promise = returned && returned.then ? returned : deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[HTTPMethods.PUT] = {};

		this[HTTPMethods.PUT][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			bindedUrls.push(url);
			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);
		    	try {
		    		interceptors.forEach(function(interceptor){
		    			interceptor(request, response);
		    		});
		    	} catch(e){
		    		response.send(401, e.message);
		    		return;
		    	}

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.body, request);
		    	} else {
		    		var deferred = Q.defer();
		    		listener(request.body, deferred, request);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[HTTPMethods.DELETE] = {};

		this[HTTPMethods.DELETE][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			bindedUrls.push(url);
			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);
		    	try {
		    		interceptors.forEach(function(interceptor){
		    			interceptor(request, response);
		    		});
		    	} catch(e){
		    		response.send(401, e.message);
		    		return;
		    	}

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.body, request);
		    	} else {
		    		var deferred = Q.defer();
		    		listener(request.body, deferred, request);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		var interceptors = [];

		this.addInterceptor = function(listener){
			interceptors.push(listener);
		};

	};

}
