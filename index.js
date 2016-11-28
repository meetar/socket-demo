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

io.on('connection', function(socket){
    // garfield = proof of life
    fs.readFile('g.jpg', function(err, buffer){
        socket.emit('image', { buffer: buffer });
    });

  ss(socket).on('blatin', function(stream, data) {
  	// console.log('blat stream received:', stream);
  	console.log('blat stream received:');

 	for(var i in io.sockets.connected) {
      //don't send the stream back to the initiator
      if (io.sockets.connected[i].id != socket.id)
      {
        var socketTo = io.sockets.connected[i]
        // var outgoingstream = ss.createStream();
        // ss(socketTo).emit('blatout', 'test');
        socketTo.send('blatout', stream);
        // ss(socketTo).emit('file', outgoingstream, data);
        // stream.pipe(outgoingstream);
      }
    }

	// stream.pipe(fs.createWriteStream('foo.txt'));
  	// socket.pipe(socket.broadcast.emit('blatout', stream));
  });

  ss(socket).on('test', function(stream, data) {
  	console.log('test stream received:');

    // ss(socket).emit('blatout', stream);

 	for(var i in io.sockets.connected) {
      //don't send the stream back to the initiator
      if (io.sockets.connected[i].id != socket.id)
      {
      	// console.log(io.sockets.connected[i].id +'!='+ socket.id);
        var socketTo = io.sockets.connected[i]
        // socketTo.send('blatout', 'test');
        socketTo.emit('blatout', 'test'); // < this works… but not sure it's what i want
        // ss(socket).emit('blatout', stream);

        // var outgoingstream = ss.createStream();
        // // stream.pipe(outgoingstream);
        // ss(socketTo).emit('testout', stream);

      }
    }

  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

