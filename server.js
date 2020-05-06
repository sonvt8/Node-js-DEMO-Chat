const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const {formatMess, infoMess} = require('./utils/mess');
const {userJoin, userLeft, currentUser, userList, verifyUser} = require('./utils/user');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server is running on port " + PORT));

const chatBot = "Tommy Chatbot";

io.on("connection", socket => {
    // Verify user if username existed or not
    socket.on("user-login", ({ username, room }) => {
        if (verifyUser(username, room) !== -1) {
            socket.emit("loginStatus", { user: username, room: room, check: false });
        } else {
            socket.emit("loginStatus", { user: username, room: room, check: true });
        }
    });

    // Server listen having new socket connection
    socket.on("joinRoom", ({ username, room }) => {
        const messCount = 0;
        const joinTime = moment();

        // GET User info
        const user = userJoin(socket.id, username, room, messCount, joinTime);

        // attach room name into socket
        socket.join(user.room);

        // Wellcome user joined
        socket.emit("server_reply", formatMess(chatBot, `Wellcome <b>${user.username}</b>!!!`));

        // Tell people new user has joined their room
        socket.broadcast.to(user.room)
              .emit("server_reply", formatMess(user.username, "Hello, I'm new in this room"));

        // Udate user list
        io.to(user.room).emit("user-list", userList(user.room));
    });

    // listen messages from client
    socket.on("message", mess => {
        user = currentUser(socket.id);
        io.to(user.room)
            .emit("server_reply", formatMess(user.username, mess));
        socket.emit("user-details", infoMess(user.messCount, user.joinTime));
    });

    // User Logout
    socket.on("disconnect", () =>{
        const user = userLeft(socket.id);
        if(user){
            // Tell everyone you are out
            socket.broadcast.to(user.room)
              .emit("server_reply", formatMess(user.username, "Bye, I'm out!"));
            
            // Udate user list
            io.to(user.room).emit("user-list", userList(user.room));
        }   
    });
});

app.get("/", function (req, res) {
    res.render("login");
});

app.get("/room", function (req, res) {
    res.render("chat-room");
});