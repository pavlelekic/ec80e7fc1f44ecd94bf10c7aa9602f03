const express = require('express');
const Twit = require('twit');
const secrets = require('./secrets.json');
const nonce = require('nonce');
const config = require('./config.json');
const queryString = require('query-string');
const reportError = require('./report-error');
const R = require('ramda');

const router = express.Router();

router.use((err, req, res, next) => {
    debugger;
    // res.status(500).end();
    // reportError(err);
});

const twit = new Twit({
    consumer_key: secrets.consumer_key,
    consumer_secret: secrets.consumer_secret,
    app_only_auth: true
});

const handleError = (res) => (err) => {
    res.status(500).end();
    reportError(err);
};

router.get('/oauth_request', (req, res) => {
    req.session.oauth = req.session.oauth || {};
    req.session.oauth.nonce = nonce();

    twit.post(
        'https://api.twitter.com/oauth/request_token',
        {
            // Don't forget to set this url on the settings page of your app, visit https://apps.twitter.com/
            oauth_callback: encodeURIComponent('http://localhost:3000/#/oauth_callback'),
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
    }).catch(handleError(res));
});

router.post('/connect', (req, res) => {
    twit.post(
        'https://api.twitter.com/oauth/access_token',
        {
            oauth_consumer_key: secrets.consumer_key,
            oauth_nonce: req.session.oauth.nonce,
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: Date.now(),
            oauth_version: '1.0',
            oauth_token: req.body.oauth_token,
            oauth_verifier: req.body.oauth_verifier
        }
    )
    .then((result) => {
        const params = queryString.parse(response.data);
        req.session.userDetails = R.omit(
            ['x_auth_expires', 'oauth_token_secret', 'oauth_token'],
            params
        );
        res.status(200).json(req.session.userDetails);
    }).catch(handleError(res));
});

router.post('/disconnect', (req, res) => {
    req.session.destroy();
    res.status(200).json(req.session.userDetails.user_id);
});

router.get('/tweets', (req, res) => {

});

module.exports = router;
