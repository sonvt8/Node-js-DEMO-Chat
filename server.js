const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const { userJoin, currentUser } = require('./utils/user');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server is running on port " + PORT));

io.on("connection", socket => {
    socket.on("joinRoom", ({ username, room }) => {
        const messCount = 0;
        const joinTime = moment();

        // GET User info
        const user = userJoin(socket.id, username, room, messCount, joinTime);
        
        // attach room name into socket
        socket.join(user.room);

        // Wellcome user joined
        socket.emit("server_reply", `Wellcome <b>${username}</b>!!!`);
    });

    // listen messages from client
    socket.on("message", mess => {
        user = currentUser(socket.id);
        io.to(user.room)
            .emit("server_reply", `${user.username} reply ${mess}`);
    });
});

app.get("/", function (req, res) {
    res.render("login");
});

app.get("/room", function (req, res) {
    res.render("chat-room");
});