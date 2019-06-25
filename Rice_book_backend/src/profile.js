//import users collection
const User = require('./model.js').User;
const Profile = require('./model.js').Profile;
const Post = require('./model.js').Post;

const auth = require('./auth.js');
const uploadCloudinary = require("../uploadCloudinary.js");
const Utility = require("./Utility");

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const md5 = require('md5');

// var sessionUser = require('./auth.js').sessionUser;
// const passportFacebook = require("../auth/link");

const getHeadlines = (req, res) => {
  var results = [];
  if (req.params.users == undefined) {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) res.status(500).send('Query error');
      var headline_elem = {
        username: profile.username,
        headline: profile.status
      };
      results.push(headline_elem);
      res.send({ headlines: results });
    });
  }
  else if (req.params.users == "loggedinUser") {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) res.status(500).send('Query error');
      var result = [];
      result.push({
        username: profile.username,
        headline: profile.status
      });

      res.send({ headlines: result });
    });
  }
  else {
    var req_users = req.params.users.split(/[ ,]+/);
    Profile.find({ username: { $in: req_users } }).exec((err, profiles) => {
      if (err) res.status(500).send('Query error');

      profiles.forEach(profile => {
        var headline_obj = {
          username: profile.username,
          headline: profile.status
        };
        results.push(headline_obj);
      });
      res.send({ headlines: results });
    });
  }
};

const putHeadlines = (req, res) => {
  if (req.body.headline == undefined || req.body.headline == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) res.status(500).send('Query error');
      profile.status = req.body.headline;
      profile.save(err => {
        if (err) res.status(500).send('Can not save the profile');
        res.send({ username: req.user.username, headline: profile.status });
      });
    });
  }
};

const getemail = (req, res) => {
  var req_user = req.params.user;
  if (!req_user) {
    res.status(500).send('Can not get the user');
  } else {
    Profile.find({ username: req_user }).exec((err, profile) => {
      if (err) res.status(500).send('Can not save the profile');
      if (profile.length == 1) {
        res.send({ username: req_user, email: profile[0].email_address });
      } else {
        res.send('No such user exists');
      }
    });
  }
};

const putemail = (req, res) => {
  if (req.body.email == undefined || req.body.email == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    var new_email = req.body.email;
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) {
        res.status(500).send('Query error');
      }
      profile.email_address = new_email;
      profile.save(err => {
        if (err) res.status(500).send('Can not save the profile');
        res.send({ username: req.user.username, email: new_email });
      });
    });
  }
};

const getzipcode = (req, res) => {
  var req_user = req.params.user;
  Profile.findOne({ username: req_user }).exec((err, profile) => {
    if (err) {
      res.status(500).send('Query error');
    }
    res.send({ username: req_user, zipcode: profile.zipcode });
  });
};

const putzipcode = (req, res) => {
  if (req.body.zipcode == undefined || req.body.zipcode == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) {
        res.status(500).send('Query error');
      }
      profile.zipcode = req.body.zipcode;
      profile.save(err => {
        if (err) res.status(500).send('Can not save the profile');
        res.send({ username: req.user.username, zipcode: req.body.zipcode });
      });
    });
  }
};

const getdob = (req, res) => {
  var req_user = req.params.user;
  Profile.findOne({ username: req_user }).exec((err, profile) => {
    if (err) {
      res.status(500).send('Query error');
    }
    if (!profile.DOB || profile.DOB == undefined) {
      res.send({ username: req_user, dob: " " });
    }
    else {
      res.send({ username: req_user, dob: profile.DOB.getTime() });
    }

  });
};

const getavatars = (req, res) => {
  var results = [];
  if (req.params.user == "loggedinUser") {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) res.status(500).send('Query error');
      results.push({
        username: profile.username,
        avatar: profile.avatar
      });
      res.send({ avatars: results });
    });
  }
  else {
    var req_users = req.params.user.split(/[ ,]+/);
    Profile.find({ username: { $in: req_users } }).exec((err, profiles) => {
      if (err) res.status(500).send('Query error');
      profiles.forEach(profile => {
        var avatar = {
          username: profile.username,
          avatar: profile.avatar
        };
        results.push(avatar);
      });
      res.send({ avatars: results });
    });
  }

};

const putavatar = (req, res) => {
  if (req.body.avatar == undefined || req.body.avatar == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) {
        res.status(500).send('Query error');
      }
      profile.avatar = req.body.avatar;
      profile.save(err => {
        if (err) res.status(500).send('Can not save the profile');
        res.send({ username: req.user.username, avatar: req.body.avatar });
      });
    });
  }
};

const getPhone_number = (req, res) => {
  var req_user = req.params.user;
  Profile.findOne({ username: req_user }).exec((err, profile) => {
    if (err) {
      res.status(500).send('Query error');
    }
    res.send({ username: req_user, phone_number: profile.phone_number });
  });
};

const putPhone_number = (req, res) => {
  if (req.body.phone_number == undefined || req.body.phone_number == '') {
    res.send({ result: 'Fail' });
    return;
  } else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (err) {
        res.status(500).send('Query error');
      }
      profile.phone_number = req.body.phone_number;
      profile.save(err => {
        if (err) res.status(500).send('Can not save the profile');
        res.send({
          username: req.user.username,
          phone_number: req.body.phone_number
        });
      });
    });
  }
};

const getprofiles = (req, res) => {
  if (req.params.user == '') {

    res.send({ result: [] });
  }
  var req_users = req.params.user.split(/[ ,]+/);
  Profile.find({ username: { $in: req_users } }).exec((err, profiles) => {
    if (err) {
      res.status(500).send('Query error');
    }
    var allprofiles = [];
    profiles.forEach(profile => {
      allprofiles.push(profile);
    });
    res.send({ result: allprofiles });
  });
};

const getname = (req, res) => {

  res.send({ username: req.user.username });
}
const getfacebookId = (req, res) => {
  console.log(req.user.facebookId);
  res.send({ facebookId: req.user.facebookId });
}
const checkLink = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (req.user.username === req.user.facebookId) {
    if (!username || !password) {
      res.send({ username: req.user.username, msg: "please fill in both username and password!" });
    }
    else {
      User.find({ username: username }).exec((err, user) => {
        if (user.length == 0) {
          res.send({ username: req.user.username, msg: "The user does not exist, or the password is wrong" });
        }
        else {
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
          }
          else {
            res.send({ username: req.username, msg: "FB_login_success" });
          }
        }
      });
    }
    // res.send({ username: req.user.username, msg: "FB_login_success" });
  }
  else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (profile.facebookId) {
        res.send({ username: req.username, msg: "The user has been linked to Facebook" });
      }
      else {
        res.send({ username: req.username, msg: "Local_login_success" });
      }
    });
  }
}


const checkUnlink = (req, res) => {
  if (req.user.facebookId === req.user.username) {
    res.send({ username: req.user.username, msg: "The user is logged in with Facebook" });
  }
  else {
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      if (!profile.facebookId) {
        res.send({ username: req.user.username, msg: "This user does not have a Linked facebook account" });
      }
      else {
        res.send({ username: req.user.username, msg: "success" });
      }
    });
  }
}

const unlinkfb = (req, res) => {
  Profile.findOne({ username: req.user.username }).exec((err, profile) => {
    var index = profile.auth.indexOf("facebook:" + profile.facebookId);
    profile.auth.splice(index, 1);
    profile.facebookId = undefined;
    profile.save((err, profile) => {
      res.send({ username: req.user.username, profile: profile });
    });
  });
}

const facebook_link_local = (req, res) => {
  //req.user is fb user
  let sysUser = req.body.username;
  let fbUser = req.user.username;
  Profile.findOne({ username: sysUser }).exec((err, user) => {
    var facebookId = fbUser;
    if (!user.auth) {
      user.auth = [];
    }
    user.facebookId = fbUser;
    var newAuth = "facebook: " + facebookId;
    if (user.auth.indexOf(newAuth) === -1) {
      user.auth.push(newAuth);
    }
    user.save((err) => {
      if (err) {
        res.status.send("Can not save this profile");
      }
      Profile.findOne({ username: facebookId }).exec((err, fbUser) => {
        if (fbUser) {
          user.followers = user.followers.concat(fbUser.followers.filter((elem) => user.followers.indexOf(elem) === -1));
          user.save((err) => {
            if (err) {
              res.status(500).send("Can not save the user");
            }
            Post.updateOne({ author: facebookId }, { author: user.username }).exec((err) => {
              if (err) {
                res.status(500).send("Can not update the information");
              }
              Profile.findOneAndDelete({ facebookId: facebookId, auth: [] }, function (err, data) {
                if (err) {
                  res.sendStatus(500)
                }
                res.send({ msg: "link successfully" });
              })
            });
          });
        }
      });
    })
  });
}

const linkfb = (req, res, next) => {

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('facebook', new FacebookStrategy({
    clientID: "286573078943988",
    clientSecret: "14d13e9df2f1f07f74befdcf877e7e6b",
    callbackURL: Utility.backendurl + "/link/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, function (accessToken, refreshToken, profile, done) {
    console.log("linkingggggg");
    console.log(req.user);
    Profile.findOne({ username: req.user.username }).exec((err, user) => {
      var facebookId = "fb" + profile.id;
      user.facebookId = facebookId;
      if (!user.auth) {
        user.auth = [];
      }
      var newAuth = "facebook: " + facebookId;
      if (user.auth.indexOf(newAuth) === -1) {
        user.auth.push(newAuth);
      }
      user.save((err) => {
        if (err) {
          res.status.send("Can not save this profile");
          done(null, profile);
        }

        Profile.findOne({ username: facebookId }).exec((err, fbUser) => {

          if (fbUser) {
            //merge the followers of two users

            user.followers = user.followers.concat(fbUser.followers.filter((elem) => user.followers.indexOf(elem) === -1));
            user.save((err) => {

              if (err) {
                res.status(500).send("Can not save the user");
                return done(null, profile);
              }
              Post.updateOne({ author: facebookId }, { author: user.username }).exec((err) => {

                if (err) {
                  res.status(500).send("Can not update the information");
                  return done(null, profile);
                }

                Profile.findOneAndDelete({ facebookId: facebookId, auth: [] }, function (err, data) {

                  if (err) {
                    res.sendStatus(500)
                    return done(null, profile);
                  }
                  return done(null, profile);
                })
              });

            });
          }
          else {
            return done(null, profile);
          }
        });

      });
    });
  }));
  next();
}

exports.setup = app => {
  app.get('/headlines/:users?', auth.isLoggedIn, getHeadlines);
  app.put('/headline', auth.isLoggedIn, putHeadlines);
  app.get('/email/:user?', getemail);
  app.put('/email', auth.isLoggedIn, putemail);
  app.get('/zipcode/:user?', getzipcode);
  app.put('/zipcode', auth.isLoggedIn, putzipcode);
  app.get('/dob/:user?', getdob);
  app.get('/avatars/:user?', auth.isLoggedIn, getavatars);
  app.put('/avatar', auth.isLoggedIn, putavatar);
  app.get('/phone_number/:user?', getPhone_number);
  app.put('/phone_number', auth.isLoggedIn, putPhone_number);
  app.get('/profiles/:user?', getprofiles);
  app.get('/username', auth.isLoggedIn, getname);
  app.get('/facebookId/:user?', auth.isLoggedIn, getfacebookId);
  app.get("/unlink", auth.isLoggedIn, checkUnlink);
  app.get("/unlink/facebook", auth.isLoggedIn, unlinkfb);

  app.post("/link", auth.isLoggedIn, checkLink);
  app.post('/link/facebook_link_local', auth.isLoggedIn, facebook_link_local);

  app.get('/link/facebook', auth.isLoggedIn, linkfb, passport.authenticate('facebook'));
  app.get('/link/facebook/callback', passport.authenticate('facebook', { failureRedirect: Utility.frontendurl + '/#/profile' }),
    function (req, res) {
      console.log("Successful Linked, redirect to main");
      res.redirect(Utility.frontendurl + "/#/main");
    });
};
