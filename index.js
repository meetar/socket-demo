var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get(/.*/, function(req, res){
  res.sendFile(__dirname + req.url);
});

io.on('connection', function(socket){
    fs.readFile('g.jpg', function(err, buffer){
    	// console.log('err?', err);
    	// console.log('buffer?', buffer);
        socket.emit('image', { buffer: buffer });
    });
  // socket.on('blat', function(msg){
  socket.on('blat', function(data){
  	console.log('blat received:');
  	// console.log(data);
  	// var imgArray = new Uint8Array(data);
  	// console.log(imgArray)
    io.emit('blat', {buffer: data});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

