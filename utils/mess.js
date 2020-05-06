const moment = require('moment');

function formatMess (username, mess){
    return {
        username,
        mess,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMess;