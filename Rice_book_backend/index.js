const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const URL = require("./src/Utility");

const setupCORS = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Access-Control-Allow-Credentials, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).send('OK');
  } else {
    next();
  }
};

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

app.use(setupCORS);

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));

require('./src/auth.js').setup(app);
require('./src/articles.js').setup(app);
require('./src/following.js').setup(app);
require('./src/profile.js').setup(app);
app.post('/test', (req, res) => {
  res.send({ msg: req.body.postMsg, result: 'success' });
});

app.get('/hello', (req, res) => {
  res.send("hello");
})
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect(URL.frontendurl + '/#/auth')
// }
// app.get('/', ensureAuthenticated, function (req, res, next) {
//   res.send({ user: req.user });
// });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
});
