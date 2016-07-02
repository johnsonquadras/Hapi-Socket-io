var Hapi = require('hapi');
var Path = require('path');
var count = 0;

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: '3000'
});

var io = require('socket.io')(server.listener);

server.register(require('vision'), function (err) {
    //Error handling here
    if (err) {
        throw err;
    }

    //Static single file
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index', {name : 'Johnson'})
        }
    });
    
      server.route({
        method: 'GET',
        path: '/users/{userName}',
        handler: function (request, reply) {
            var name = encodeURIComponent(request.params.userName);
            reply.view('user', {name : name})
        }
    });


    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });

});

count = 0;
//Socet io code
io.on('connection',function(socket){
    socket.emit('connection',{count : count})
    
    socket.on('increase',function(data){
        count++
         console.log(count)
        io.sockets.emit('count',{count : count})
    })
}) 

server.start(function () {
    console.log('Server started at', server.info.uri);
})