const {format} = require('timeago.js');
const dateFormat = require('handlebars-dateformat')


const helpers = {};

helpers.timeago = (savedTimestamp) => {
    return format(savedTimestamp);
};

helpers.dateformat = (savedTimestamp) => {
    return dateFormat(savedTimestamp);
};



module.exports = helpers;