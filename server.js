const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chatapp/index.html');
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/chatapp/style.css');
});

app.get('/app.js', (req, res) => {
  res.sendFile(__dirname + '/chatapp/app.js');
});

app.get('/*.jpg', (req, res) => {
  res.sendFile(__dirname + '/assests/background.jpg');
});

io.on('connection', (socket) => {
  console.log('user connected ');

  socket.on('setUsername', function (data) {
    console.log(data);
    if (users.indexOf(data) > -1) {
      socket.emit('userExists', data + ' username is taken!');
    } else {
      users.push(data);
      socket.emit('userSet', { username: data });
    }

  });

  socket.on('message', msg => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on :3000');
});



