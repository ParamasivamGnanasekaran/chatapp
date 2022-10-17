
let socket = io();
let user;
let formName = document.querySelector('#nameForm');
let inputName = document.querySelector('#name');
let form = document.querySelector('#messageForm');
let input = document.querySelector('#message');
let ulData = document.querySelector("#data");
 let chatDisplay = document.querySelector('#chatDisplay');
  

  socket.on('userSet', function(data){
    user = data.username;
    if(user){
      chatDisplay.classList.remove("display");
      formName.classList.add("display");
    }
 });

 socket.on('userExists', function(data){
  document.getElementById('error-container').innerHTML = data;
});

  formName.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('setUsername', document.getElementById('name').value);
  });



  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('message', {message: input.value, user: user});
      let item =  document.createElement('li');
        item.classList.add('me');
        item.innerHTML= '<b>' + user + '</b>:<br> ' + input.value ;
        ulData.append(item); 
        window.scrollTo(0, document.body.scrollHeight);
      input.value = '';
    }
  });

  socket.on('message', function(msg) {
        let item =  document.createElement('li');
        item.classList.add('other');
        item.innerHTML= '<b>' + msg.user + '</b>:<br> ' + msg.message ;
        ulData.append(item); 
        window.scrollTo(0, document.body.scrollHeight);

  });;
