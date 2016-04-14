var google = require('googleapis');

module.exports = function(auth, labelId) {
    var gmail = google.gmail('v1');
        gmail.users.threads.list({
        auth: auth,
        userId: 'me',
        labelIds: labelId
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }

        console.log(response);
    });
};
