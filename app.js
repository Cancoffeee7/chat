var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

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
  });
  
  socket.on('message', function(data){
    socket.get('room', function(error, room){
      io.sockets.in(room).emit('message', data);
    });
  });
  
});
