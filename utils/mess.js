const moment = require('moment');

function formatMess (username, mess){
    return {
        username,
        mess,
        time: moment().format('h:mm a')
    };
}

function infoMess (messCount, joinTime){
    return {
        messCount,
        duration: moment().to(joinTime)
    };
}

module.exports = {formatMess, infoMess};