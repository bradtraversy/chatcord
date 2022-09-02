const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().utcOffset('+00:00').format('h:mm a')// '+0x.00' x depend on timezone of user
  };
}

module.exports = formatMessage;
