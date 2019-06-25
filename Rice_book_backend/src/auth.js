const cookieParser = require('cookie-parser');
const Utility = require('./Utility.js');
//import users collection
const User = require('./model.js').User;
const Profile = require('./model.js').Profile;
const Post = require('./model.js').Post;
const Comment = require('./model.js').Comment;

//import md5 to hash
const md5 = require('md5');


// const passportFacebook = require("../auth/facebook");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
//Session
var mySecretMessage = 'Ricebook';
var cookieKey = 'SessionId';
var sessionUser = {};

const userLogin = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  if (!username || !password) {
    res.status(400).send('Unable to get username or password');
  } else {
    User.find({ username: username }).exec((err, user) => {
      if (user.length == 0) {
        res.send({
          result: 'fail',
          msg: 'The user does not exist, or the password is wrong!!'
        });
      } else {
        //fetch the salt and hashcode
        var userSalt = user[0].salt;
        var userHash = user[0].hash;

        var _hash = md5(password + userSalt);
        if (_hash != userHash) {
          res.send({
            username: user[0].username,
            result: 'fail',
            msg: 'The user does not exist, or the password is wrong!!'
          });
        } else {
          const sessionKey = md5(
            mySecretMessage + new Date().getTime() + user[0].username
          );
          sessionUser[sessionKey] = user[0];
          //set a cookie
          res.cookie(cookieKey, sessionKey, {
            maxAge: 3600 * 1000,
            httpOnly: true
          });
          res.send({
            username: user[0].username,
            result: 'success'
          });
        }
      }
    });
  }
};

const userRegister = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var display_name = req.body.display_name;
  var email_address = req.body.email_address;
  var phone_number = req.body.phone_number;
  var DOB = req.body.DOB;
  var zipcode = req.body.zipcode;
  var status = req.body.status;
  var avatar = '';
  var following = [];

  if (!username || !password || !email_address || !DOB || !zipcode) {
    res.status(400).send('Missing important information!!');
    return;
  } else {
    User.find({ username: username }).exec((err, user) => {
      if (err) {
        res.status(500).send('Query Error');
      } else {
        // res.send({result: user.length});
        if (user.length == 0) {
          //record username, salt, and hash of salted password
          var salt = username + new Date().getTime();
          var hash = md5(password + salt);
          var newUser = new User({
            username: username,
            salt: salt,
            hash: hash
          });
          newUser.save(err => {
            if (err) res.status(500).send('Can not add the user');
          });

          //record the profile information
          var newProfile = new Profile({
            username: username,
            password: password,
            display_name: display_name,
            email_address: email_address,
            phone_number: phone_number,
            DOB: DOB,
            zipcode: zipcode,
            status: status,
            avatar: avatar,
            followers: []
          });

          newProfile.save(err => {
            if (err) res.status(500).send('Can not add the profile');
          });

          res.send({ result: 'success', username: username });
        } else {
          res.send({ result: 'fail', username: username });
        }
      }
    });
  }
};

const isLoggedIn = (req, res, next) => {
  var sKey = req.cookies[cookieKey];
  if (!sKey) {
    return res.status(401).send({ result: 'failed' });
  }
  var user = sessionUser[sKey];
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ result: 'failed' });
  }
};

const logout = (req, res) => {
  delete sessionUser[req.cookies[cookieKey]];
  res.clearCookie(cookieKey);
  res.send({ result: 'OK' });
};

const changePassword = (req, res) => {
  var new_Password = req.body.password;
  if (new_Password == undefined || new_Password == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    User.findOne({ username: req.user.username }).exec((err, user) => {
      if (err) {
        res.send('Query error');
      } else {
        var newHash = md5(new_Password + user.salt);
        user.hash = newHash;
        user.save(err => {
          if (err) {
            res.status(500).send('Can not save the user');
          }
          res.send({ username: req.user.username, result: 'success' });
        });
      }
    });
  }
};

async function deleteDate() {
  await Profile.deleteMany();
  await User.deleteMany();
  await Post.deleteMany();
  await Comment.deleteMany();
}

const resetAll = (req, res) => {


  deleteDate().then(() => {
    delete sessionUser[req.cookies[cookieKey]];
    res.clearCookie(cookieKey);

    Utility.testuser.forEach((elem) => {
      var test_salt = elem.username + new Date().getTime();
      var test_hash = md5(elem.password + test_salt);
      var testUser = new User({
        username: elem.username,
        salt: test_salt,
        hash: test_hash
      });
      testUser.save(() => {
        var userProfile = new Profile({
          username: elem.username,
          display_name: elem.display_name,
          email_address: elem.email_address,
          phone_number: elem.phone_number,
          DOB: elem.DOB,
          zipcode: elem.zipcode,
          status: elem.status,
          avatar: elem.avatar,
          followers: elem.followers
        });
        userProfile.save();
      });
    });


    var test_posts = Utility.posts;
    for (let i = 0; i < test_posts.length; i++) {
      var newPost = new Post({
        _id: i,
        author: test_posts[i].author,
        image: test_posts[i].image,
        text: test_posts[i].text,
        date: new Date(),
        comments: test_posts[i].comments
      });
      newPost.save();
    }
    res.send({ result: 'success' });
  });
};


const fblogin = (req, res, next) => {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use("facebook", new FacebookStrategy({
    clientID: "286573078943988",
    clientSecret: "14d13e9df2f1f07f74befdcf877e7e6b",
    callbackURL: Utility.backendurl + "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
    function (accessToken, refreshToken, profile, done) {
      var facebookId = 'fb' + profile.id;
      Profile.findOne({ facebookId: facebookId }).exec((err, user) => {
        if (!user) {
          var newUser = new Profile({
            facebookId: facebookId,
            username: facebookId,
            display_name: profile.displayName,
            email_address: "",
            phone_number: "",
            DOB: "",
            zipcode: "",
            status: "",
            avatar: profile.photos ? profile.photos[0].value : "",
            followers: []
          });
          newUser.save((err) => {
            if (err) {
              res.status("500").send("Can not save the profile");
              done(err);
            }
            done(null, profile);
          });
        }
        else {
          done(null, profile);
        }
      });
    }
  ))
  next();
}
exports.isLoggedIn = isLoggedIn;
exports.setup = app => {
  app.get('/auth/facebook', fblogin, passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: Utility.frontendurl + '/#/auth' }),
    function (req, res) {
      console.log("the req.user is:");
      console.log(req.user);
      console.log("Successful authentication, redirect home");
      Profile.findOne({ facebookId: 'fb' + req.user.id }).exec((err, user) => {
        const sessionKey = md5(
          mySecretMessage + new Date().getTime() + user.username
        );
        req.user = user;
        res.cookie(cookieKey, sessionKey, { maxAge: 3600 * 1000, httpOnly: true });
        sessionUser[sessionKey] = user;
        res.redirect(Utility.frontendurl + '/#/main');
      });
    });
  app.post('/login', userLogin);
  app.post('/register', userRegister);
  app.put('/logout', isLoggedIn, logout);
  app.put('/password', isLoggedIn, changePassword);
  app.get('/resetAll', resetAll);
};
