let socket = io();
let user;
let formName = document.querySelector('#nameForm');
let inputName = document.querySelector('#name');
let form = document.querySelector('#messageForm');
let input = document.querySelector('#message');
let ulData = document.querySelector("#data");
let chatDisplay = document.querySelector('#chatDisplay');
let type = document.getElementById('typing')

socket.on('userSet', function (data) {
  user = data.username;
  if (user) {
    chatDisplay.classList.remove("display");
    formName.classList.add("display");
    let item = document.createElement('li');
    item.classList.add('join');
    item.innerHTML = '<b>You </b>Joined to Chat';
    ulData.append(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
});

socket.on('userSets', function (data) {
  let item = document.createElement('li');
  item.classList.add('join');
  item.innerHTML = '<b>' + data.username + '</b>' + ' Joined to Chat';
  ulData.append(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('userExists', function (data) {
  document.getElementById('error-container').innerHTML = data;
});

formName.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('setUsername', document.getElementById('name').value);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('message', { message: input.value, user: user });
    let item = document.createElement('li');
    item.classList.add('me');
    item.innerHTML = '<b>You</b>:<br> ' + input.value;
    ulData.append(item);
    window.scrollTo(0, document.body.scrollHeight);
    input.value = '';
  }
});

socket.on('message', function (msg) {
  let item = document.createElement('li');
  item.classList.add('other');
  item.innerHTML = '<b>' + msg.user + '</b>:<br> ' + msg.message;
  ulData.append(item);
  window.scrollTo(0, document.body.scrollHeight);

});;

socket.on('userDisconnect', function (data) {
  let item = document.createElement('li');
  item.classList.add('disconnect');
  item.innerHTML = '<b>' + data + '</b>' + ' disconnected to Chat';
  ulData.append(item);
  window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('input', function (e) {
  e.preventDefault();
  socket.emit('typing',  user );
});

socket.on('getTypingStatus', (data) => {
  type.innerHTML = '<b>' + data + '</b>' + " typing...";
  setTimeout(() => {
    type.innerHTML = "";
  }, 3000); 
})