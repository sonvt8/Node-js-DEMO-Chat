const socket = io();

$(document).ready(function(e){
    $('.registerbtn').click(function(e){
        e.preventDefault();
        var room = $('#room').val();
        var username = $('#username').val();
        socket.emit('user-login', {username, room});
    });
})

socket.on('loginStatus', data => {
    if(data.check === false){
        alert(data.user + " has already existed in room " + data.room);
    }else{
        $('#login-form').submit();
    }
});