var auth = require('./lib/auth');
var listLabels = require('./lib/list-labels');
var listThreads = require('./lib/list-threads');
var getMessage = require('./lib/get-message');

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
