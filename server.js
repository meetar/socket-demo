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
    fs.readFile('g.png', function(err, buffer){
        socket.emit('image', { buffer: buffer });
    });

  ss(socket).on('blatin', function(stream, data) {
  	console.log('blat stream received:');
  	// console.log('stream:', stream);
  	// console.log('data:', data);

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

  ss(socket).on('test', function(stream, data) {
 	for(var i in io.sockets.connected) {
      //don't send the stream back to the initiator
      if (io.sockets.connected[i].id != socket.id)
      {
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

//   ss(socket).on('test', function(stream, data) {
//   	console.log('test stream received:');

//   	// console.log(stream);
//     // ss(socket).emit('blatout', stream);

//  	for(var i in io.sockets.connected) {
//       //don't send the stream back to the initiator
//       if (io.sockets.connected[i].id != socket.id)
//       {
//       	// console.log(io.sockets.connected[i].id +'!='+ socket.id);
//         var socketTo = io.sockets.connected[i];
//         // socketTo.send('blatout', 'test');
//         // socketTo.emit('blatout', 'test'); // < this works… but not sure it's what i want
//         // socketTo.emit('blatout', stream); // < this works too! i got a message from the client to the remote!!
//         // stream.pipe(socketTo);
//         // ss(socket).emit('blatout', stream);

//         var outgoingstream = ss.createStream();
//         // ss(socketTo).emit('testout', stream);
//         // ss(socketTo).emit('testout', outgoingstream);
//         // socketTo.emit('testout', outgoingstream, 'testout!'); // works!!
//         // socketTo.emit('testout', outgoingstream, stream); // works!! but array comes through as a js object

//         // console.log('stream:', stream);
//         console.log('blatout:');
//         ss(socketTo).emit('blatout', outgoingstream);
//         stream.pipe(outgoingstream);

//       }
//     }

//   });

// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

