

function App(){

	var HTTPServer 			= require("./HTTPServer");

	var ExpressAdapter 		= require("./ExpressAdapter");

	var HTTPMethods  		= require("./HTTPMethods");

	var httpServer 			= new HTTPServer(new ExpressAdapter(), 8080, "localhost");

	httpServer.start();

	httpServer.addHTTPListerner('/login', HTTPMethods.POST, function(user, resolver){

		if(user.login === "login" && user.password === "password"){
			resolver.resolve("Logged!");
		} else {
			resolver.reject("Not Logged!");
		}
	});

}

new App();