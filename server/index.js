const express = require('express');
const routes = require('./routes');
const config = require('./config.json');
const cors = require('cors');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const secrets = require('./secrets.json');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session({
    store: new FileStore(),
    secret: secrets.session_secret,
    resave: false,
    saveUninitialized: false
}));
app.use(routes);

app.listen(
    config.port,
    () => console.log(`Listening on port ${config.port}!`)
);
