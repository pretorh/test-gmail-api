var googleAuth = require('google-auth-library');

var fs = require('fs');
var readline = require('readline');

exports.readClientSecret = function(file, callback) {
    fs.readFile(file, function(err, content) {
        if (err)
            return callback(err);
        callback(null, JSON.parse(content));
    });
};

exports.authorize = function(credentials, scopes, cache, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    fs.readFile(cache.path, function(err, token) {
        if (err) {
            exports.getNewToken(oauth2Client, scopes, cache, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
};

exports.getNewToken = function(oauth2Client, scopes, cache, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    console.log('Authorize this app by visiting this url: ', authUrl);

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }

            oauth2Client.credentials = token;
            exports.storeToken(token, cache);
            callback(oauth2Client);
        });
    });
}

exports.storeToken = function(token, cache) {
    try {
        fs.mkdirSync(cache.dir);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(cache.path, JSON.stringify(token));
    console.log('Token stored to ' + cache.path);
}
