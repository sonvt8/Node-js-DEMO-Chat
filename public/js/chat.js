const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// User Join Room
socket.emit("joinRoom", { username, room });

$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
    $('.send_btn').click(function (e) {
        e.preventDefault();
        const mess = $('.type_msg').val();
        socket.emit("message", mess);
        // Get empty box when messages sent
        $('.type_msg').val('').focus();
    });
});

socket.on("server_reply", data => {
    console.log(data);
});