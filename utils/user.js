const users = [];
const moment = require('moment');

function userJoin (id, username, room, messCount, joinTime){
    const duration = moment().to(joinTime);
    const userInfo =  {id, username, room, messCount, joinTime, duration};
    users.push(userInfo);
    return userInfo;
}

function userLeft (id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

function currentUser (id){
    const userChat = users.find(user => user.id === id);
    userChat.messCount += 1;
    return userChat;
}

function userList(room){
    const lst = users.filter(user => user.room === room);
    lst.forEach(user => {
        user.duration = moment().to(user.joinTime);
    });
    return lst;
}

function verifyUser(username, room){
    return users.findIndex(user => user.username === username && user.room === room);
}

module.exports = {userJoin, userLeft, currentUser, userList, verifyUser};