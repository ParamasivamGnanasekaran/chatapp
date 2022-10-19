const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let users = [];
let user=[];
let port = process.env.PORT||3000;
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
    if (users.indexOf(data) > -1) {
      socket.emit('userExists', data + ' username is taken!');
    } else {
      users.push(data);
      user[socket.id]=data;
      socket.emit('userSet', { username: data });
      socket.broadcast.emit('userSets', { username: data });
      console.log(`user Connected ${user[socket.id]}`);
    }
  });

  socket.on('typing',(name)=>{
    socket.broadcast.emit('getTypingStatus', name );
   });

  socket.on('message', msg => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('disconnect', (data) => {
    socket.broadcast.emit('userDisconnect', user[socket.id]);
    console.log(`user disconnected ${user[socket.id]}`);
    users.splice(users.indexOf(user[socket.id]), 1);
    delete user[socket.id];
  });
});

server.listen(port, () => {
  console.log('listening on :3000');
});



