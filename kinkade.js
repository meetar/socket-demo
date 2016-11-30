/*jslint browser: true*/
/*global Tangram, gui */

var canvas = document.getElementById('kcanvas');

canvas.onselectstart = function(){ return false; };
canvas.onselectend = function(){ console.log('done'); };
var x = 0;
var y = 0;
var lastX;
var lastY;
var colorHex = "ffffff";
var color = {r: 100, g: 100, b: 100};
var alpha = .02;

function updateColor(val) {
    valRGB = hexToRgb(val);
    color = {r: valRGB.r, g: valRGB.g, b: valRGB.b};
    document.getElementById("picker").value = val;
}
function setColor(val) {
    document.getElementById('picker').jscolor.fromString(val);
    updateColor(val);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function draw(x,y,w,r,g,b,a){
        var gradient = ctx.createRadialGradient(x, y, 0, x, y, w);
        gradient.addColorStop(0, 'rgba('+r+', '+g+', '+b+', '+a+')');
        gradient.addColorStop(1, 'rgba('+r+', '+g+', '+b+', 0)');

        ctx.beginPath();
        ctx.arc(x, y, w, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
};

var ctx = canvas.getContext('2d');
var w = 10;
var radius = w/2;
var drawing = false;

canvas.addEventListener("mousedown", function(e){
    drawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    w = 50;
    draw(lastX, lastY,w,color.r,color.g,color.b, alpha);
});
canvas.addEventListener("mouseup", function(){
    drawing = false;
    // scene.loadTextures();
    sendBlat();
    saveCanvas();
});

function saveCanvas() {
    // save current state in case of undo
    URL.revokeObjectURL(lastCanvas.url);
    canvas.toBlob(function(blob) {
        lastCanvas.url = URL.createObjectURL(blob);
    });
}
// based on http://stackoverflow.com/a/17359298/738675
canvas.addEventListener("mousemove", function(e){
    if(drawing == true){
        x = e.offsetX;
        y = e.offsetY;
        // the distance the mouse has moved since last mousemove event
        var dis = Math.sqrt(Math.pow(lastX-x, 2)+Math.pow(lastY-y, 2));

        // for each pixel distance, draw a circle on the line connecting the two points
        // to get a continous line.
        for (i=0;i<dis;i+=1) {
            var s = i/dis;
            draw(lastX*s + x*(1-s), lastY*s + y*(1-s),w,color.r,color.g,color.b, alpha);
        }
        lastX = x;
        lastY = y;
        sendBlat();
        // throttle(sendBlat, 50);
        // scene.loadTextures();
    };
});

updateColor(document.getElementById("picker").value);

// fill canvas with white
function clearCanvas() {
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fill();
}
clearCanvas();
var lastCanvas = {url: null};

function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

var socket = io();
var stream = ss.createStream();
ss(socket).emit('file', stream);
// var imageBuffer = new ss.Buffer(256*256*4);
function sendBlat() {
    console.log('blatting'); 
    // send buffer to the server
    var dataurl = canvas.toDataURL();
    // canvas.toBlob(function(blob) {
    var blobstream = new ss.createBlobReadStream(blob);


        dataurl
        blobstream.pipe(stream);

        // stream.write(new ss.Blob(blob));
        // ss(socket).emit('blatin', stream);



    // imageBuffer.set(ctx.getImageData(0,0,canvas.width,canvas.height).data);
    // stream.write(imageBuffer);
    // ss(socket).emit('blatin', stream);
    return false;
}
