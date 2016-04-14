var google = require('googleapis');

module.exports = function(auth, match) {
    var gmail = google.gmail('v1');
        gmail.users.labels.list({
        auth: auth,
        userId: 'me',
    }, function(err, response) {
        if (err) {
            console.error('The API returned an error: ' + err);
            return;
        }
        var labels = response.labels;
        if (labels.length == 0) {
            console.log('No labels found.');
        } else {
            console.log('Labels:');
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                if (label.name.match(match)) {
                    console.log(label);
                }
            }
        }
    });
};
