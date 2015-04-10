/**
 * Created by deathowl on 4/7/15.
 */

var    config = require('./lib/config');
var    http = require('http');
var    pubSub = require('node-redis-pubsub');
var    websocketServer = require('websocket').server;
var    connectionregistry = require('./lib/connection-registry');
var _ = require('lodash');


config.configFile(process.argv[2], function (config, oldConfig) {
    var server = http.createServer(function(request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });
    server.listen(config.listenPort, function() {
        console.log((new Date()) + ' Server is listening on port:'+ config.listenPort);
    });
    var pubsubOptions = {
        host:  process.env.HUEY_LISTENER_REDIS_HOST || config.redisHost,
        port:  process.env.HUEY_LISTENER_REDIS_PORT ||config.redisPort
    };
    var wsConfig = {
        httpServer: server
    };
    var  wsServer = new websocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });
    var pubsub = pubSub(pubsubOptions);

    var registry = new connectionregistry.ConnectionRegistry();
    var allowed_origins = process.env.ALLOWED_ORIGINS || config.allowedOrigins;
    function originIsAllowed(origin) {
        return allowed_origins == "all" || origin in allowed_origins;
    }

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');
        job_id = request.resourceURL.pathname.replace('/', '');
        registry.register(job_id, connection);
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' added to the connection registry, will be notified for:' + job_id);
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            registry.deregister(connection);
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' deregistered from connection registry.');

        });
    });
    pubsub.on("*", function (data, channel) {
        if (data.hasOwnProperty("id") && data.hasOwnProperty("task")) {
            subscribers_for_key = registry.get_clients_for(data["id"]);
            subscribes_for_all = registry.get_clients_for("all");
            connections = _.union(subscribers_for_key, subscribes_for_all);
            for (var id in connections) {
                connections[id].sendUTF(JSON.stringify(data));
            }
        }
        else {
            //this is not a huey task, discard
        }
    });
    server.on("error", function (err) {
      console.log("server error:\n" + err.stack, 'ERROR');
      server.close();
    });

    server.on("listening", function () {
      var address = server.address();
      console.log("server listening " +
          address.address + ":" + address.port, 'INFO');
    });

});
