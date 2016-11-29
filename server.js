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

var remote;

io.on('connection', function(socket){
	socket.setMaxListeners(20);
    // cat = proof of life
    fs.readFile('g.png', function(err, buffer){
        socket.emit('image', { buffer: buffer });
    });

    socket.on('remote-connect', function() {
    	console.log('remote-connect; setting socket')
    	remote = socket;
    });

  	ss(socket).on('blatin', function(stream, data) {
	  	// console.log('blat stream received:');

	    var outgoingstream = ss.createStream();
	    ss(remote).emit('blatout', outgoingstream);
	    stream.pipe(outgoingstream);

  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

