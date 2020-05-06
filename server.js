const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
const userJoin = require('./utils/user');

const app = express();
const server = http.Server(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log("Server is running on port " + PORT));

io.on("connection", socket => {
    console.log("user login");
    socket.on("joinRoom", ({username, room}) => {
        const messCount = 0;
        const joinTime  = moment();

        // GET User info
        const user = userJoin(socket.id,username, room, messCount, joinTime);
        console.log(user);
    });
    
    socket.on("disconnect", () =>{
        console.log("user disconnect");
    });
});

app.get("/", function(req, res){
    res.render("login");
});

app.get("/room", function(req, res){
    res.render("chat-room");
});