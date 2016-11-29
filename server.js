var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');

var fs = require("fs");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get(/.*/, function(req, res){
  res.sendFile(__dirname + req.url);
});

io.setMaxListeners(15);
app.setMaxListeners(15);
http.setMaxListeners(15);

io.on('connection', function(socket){
	socket.setMaxListeners(20);
    // cat = proof of life
    fs.readFile('g.png', function(err, buffer){
        socket.emit('image', { buffer: buffer });
    });

  ss(socket).on('blatin', function(stream, data) {
  	console.log('blat stream received:');

 	for(var i in io.sockets.connected) {
        //don't send the stream back to the initiator
        if (io.sockets.connected[i].id != socket.id) {
	        var socketTo = io.sockets.connected[i];
	        // socketTo.emit('blatout', 'test'); // < this works
	        // socketTo.emit('blatout', stream); // < this works too - i got a message from the client to the remote
	        var outgoingstream = ss.createStream();
	        ss(socketTo).emit('blatout', outgoingstream);
	        stream.pipe(outgoingstream);
	    }
    }

  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

