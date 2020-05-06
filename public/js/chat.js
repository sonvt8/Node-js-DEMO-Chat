const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Return User profile (just join room)
userOutput(username, room)

// User Join Room
socket.emit("joinRoom", { username, room });

$(document).ready(function () {
    $('#action_menu_btn').click(function () {
        $('.action_menu').toggle();
    });
    // Trigger a Button Click on Enter
    $('.type_msg').keypress(function (e) {
        if (e.which === 13) {
            $('.send_btn').click();
            return false;
        }
    });
    $('.send_btn').click(function (e) {
        e.preventDefault();
        const mess = $('.type_msg').val();
        socket.emit("message", mess);
        // Get empty box when messages sent
        $('.type_msg').val('').focus();
    });
    $('#logout').click(function(){
        const url = "http://localhost:3000/";
        $(location).attr('href',url);
    });
});

// Return message to DOM
socket.on("server_reply", ({ username, mess, time }) => {
    messOutput(username, mess, time);
    $('#chat-messages').scrollTop($('#chat-messages').height());
});

// Update messages summary and time duration in room
socket.on("user-details", ({ messCount, duration }) => {
    messCountOutput(messCount, duration);
});


// Return data to DOM

// For message
function messOutput(username, mess, time) {
    const text = `<b>${username}</b>: ${mess} <span class="msg_time">${time}</span>`
    const data = ` <div class="d-flex justify-content-start mb-4">
                        <div class="img_cont_msg">
                            <img src="img/user.png"
                            class="rounded-circle user_img_msg">
                        </div>
                        <div class="msg_cotainer">${text}</div>
                    </div> `
    $('#chat-messages').append(data);
};

// For header user info
function userOutput(username, room) {
    $('.user_intro').html(
        `
            <span>Chat with ${username} - Room:${room}</span>
            <p>0 Message - just join</p>
        `
    );
}

// For message + time duration (after chatting)
function messCountOutput(messCount, duration) {
    $('.user_intro > p').html(
        `${messCount} Messages - Online: ${duration}`
    );
}