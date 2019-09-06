const {format} = require('timeago.js');

const helper = {};

helper.timeago = (timestamp) => {
    console.log(timestamp);
    return format(timestamp);
};

module.exports = helper;