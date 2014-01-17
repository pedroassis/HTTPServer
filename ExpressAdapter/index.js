

module.exports = ExpressAdapter;

function ExpressAdapter(){

	var Q 					= require('q');

	var express 			= require('express');

	var MediaType   		= require("../MediaType");

	var HTTPMethods  		= require("../HTTPMethods");

	var server 				= express();

	server.use(express.compress());
	server.use(express.bodyParser());

	server.use(express.errorHandler());

	this.getListenerBinder = function(){
		return defaultListeners;
	};

	this.listen = server.listen.bind(server);

	var defaultListeners = new DefaultListeners();

	function DefaultListeners(){

		this[HTTPMethods.GET] = {};

		this[HTTPMethods.GET][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			console.log("binding url: " + url + ", method: " + options.type);

			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);

		    	var promise;

		    	if(listener.length === 0){
		    		promise = listener();
		    	} else {
		    		var deferred = Q.defer();
		    		listener(deferred);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[HTTPMethods.POST] = {};

		this[HTTPMethods.POST][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			console.log("binding url: " + url + ", method: " + options.type);
			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.body);
		    	} else {
		    		var deferred = Q.defer();
		    		listener(request.body, deferred);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

		this[HTTPMethods.PUT] = {};

		this[HTTPMethods.PUT][MediaType.JSON] = function(url, listener, options, bindCallbacks){
			console.log("binding url: " + url + ", method: " + options.type);
			server[HTTPMethods[options.type]](url, function(request, response){
		    	response.setHeader('Content-Type', MediaType.JSON);

		    	var promise;

		    	if(listener.length <= 1){
		    		promise = listener(request.body);
		    	} else {
		    		var deferred = Q.defer();
		    		listener(request.body, deferred);
		    		promise = deferred.promise;
		    	}

		    	bindCallbacks(promise, options, request, response);
		    	
			});
		};

	};

}
