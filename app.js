var app = require('express')()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);
//, db = require('mongojs').connect('node', ['chatLog']);
var mongojs = require('mongojs');

var db = mongojs('node');
var chatLog = db.collection('chatLog');

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });
  //socket.on('my other event', function (data) {
  //  console.log(data);
  //});
  socket.on('join', function(data){
    socket.join(data);
    socket.set('room', data);
    var date = new Date();
    var strDate = date.getFullYear() + ":" + date.getMonth() + ":" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    console.log("Time : " + date.toLocaleString() );
    console.log("Session Id : " + socket.id);

    chatLog.save(
      { 
        time : strDate,
        id : socket.id,
        room : data
      }
    );
    
  });
  
  socket.on('message', function(data){
    socket.get('room', function(error, room){
      io.sockets.in(room).emit('message', data);
    });
  });
  
});
