const users = [];
const moment = require('moment');

function userJoin (id, username, room, messCount, joinTime){
    const duration = moment().to(joinTime);
    const userInfo =  {id, username, room, messCount, joinTime, duration};
    users.push(userInfo);
    return userInfo;
}

function currentUser (id){
    const userChat = users.find(user => user.id === id);
    userChat.messCount += 1;
    return userChat;
}

module.exports = {userJoin, currentUser};