var google = require('googleapis');

var util = require('util');

module.exports = function(auth, format, messageId) {
    var gmail = google.gmail('v1');
    gmail.users.messages.get({
        auth: auth,
        'userId': 'me',
        'format': format,
        'id': messageId
    }, function(e, data) {
        if (e) {
            console.error(e);
            return;
        }

        console.log(util.inspect(data, false, null));
    });
};
