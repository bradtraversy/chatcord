const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

function locationGenerator(username,coords){
  return{
    username,
    lat:coords.lat,
    lon:coords.lon,
    time: moment().format('h:mm a')
  }
}

module.exports = {
  locationGenerator,
  formatMessage
};
