/**
 * Created by deathowl on 4/8/15.
 */
var ConnectionRegistry = function () {
     this.registry = new Array();
};

ConnectionRegistry.prototype = {
    register: function (job_id, connection){
         if(!(job_id in this.registry)) {
             this.registry[job_id] = [connection];
         } else {
             this.registry[job_id].push(connection);
         }
    },
    deregister: function (connection) {
        for (var job_id in this.registry) {
                var index = this.registry[job_id].indexOf(connection);
                if (index !== -1) {
                    // remove the connection from the pool
                    this.registry[job_id].splice(index, 1);
                }
                if(this.registry[job_id].length == 0) {
                    delete this.registry[job_id];
                }
        }
    },
    get_clients_for: function(job_id) {
         var clients;
         if(!(job_id in this.registry)) {
             clients = [];
         } else {
             clients = this.registry[job_id];
         }
        return clients
    }
};

exports.ConnectionRegistry = ConnectionRegistry;