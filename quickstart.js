var auth = require('./lib/auth');

var google = require('googleapis');
var util = require('util');

var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = '.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';

auth.readClientSecret('client_secret.json', function processClientSecrets(err, secret) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }

    var cache = {
        dir: TOKEN_DIR,
        path: TOKEN_PATH,
    };
    auth.authorize(secret, SCOPES, cache, authorized);
});

function authorized(auth) {
    if (process.argv[2] === 'threads') {
        listThreads(auth, process.argv[3]);
    } else if (process.argv[2] === 'list-labels') {
        listLabels(auth, process.argv[3]);
    } else if (process.argv[2] === 'message-full') {
        getMessage(auth, 'full', process.argv[3]);
    } else if (process.argv[2] === 'message') {
        getMessage(auth, 'minimal', process.argv[3]);
    } else {
        console.error('invalid command');
    }
}

function listLabels(auth, match) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
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
}

function listThreads(auth, labelId) {
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
}

function getMessage(auth, format, messageId) {
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
}
