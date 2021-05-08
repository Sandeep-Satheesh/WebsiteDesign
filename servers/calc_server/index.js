const Hapi = require('hapi');
// Store the hosting server and the port
const host = 'localhost';
const port = 3000;
// Lets create the server here
const server = Hapi.Server({
 host: host,
 port: port,
 routes : { cors: true }
});
// Create an init method to start the server.
const init = async () => {
 await server.start();
 console.log("RESTful calculator web server up and running at port: " + port);
}

require('./routes/routes')(server); 
// Call the init method.
init();