const express = require('express');
const Twit = require('twit');
const secrets = require('./secrets.json');
const nonce = require('nonce');
const config = require('./config.json');
const queryString = require('query-string');
const reportError = require('./report-error');

const router = express.Router();

const T = new Twit({
    consumer_key: secrets.consumer_key,
    consumer_secret: secrets.consumer_secret,
    app_only_auth: true
});

router.get('/oauth_request', (req, res) => {
    req.session.oauth = req.session.oauth || {};
    req.session.oauth.nonce = nonce();

    T.post(
        'https://api.twitter.com/oauth/request_token',
        {
            // Don't forget to set this url on the settings page of your app, visit https://apps.twitter.com/
            oauth_callback: encodeURIComponent(`http://localhost:3000/#/oauth_callback`),
            oauth_consumer_key: secrets.consumer_key,
            oauth_nonce: req.session.oauth.nonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Date.now(),
            oauth_version: '1.0'
        }
    ).then((response) => {
        const params = queryString.parse(response.data);

        req.session.oauth = req.session.oauth || {};
        req.session.oauth = {...req.session.oauth, params};

        res.status(200).json({
            authorizationUrl: `https://api.twitter.com/oauth/authenticate?oauth_token=${params.oauth_token}`
        });
    }).catch(function (err) {
        res.status(500).end();
        reportError(err);
    });
});

router.post('/disconnect', (req, res) => {

});

router.get('/tweets', (req, res) => {

});

module.exports = router;
