//import users collection
const User = require('./model.js').User;
const Profile = require('./model.js').Profile;

const auth = require('./auth.js');
// var sessionUser = require('./auth.js').sessionUser;

const getFollowers = (req, res) => {
  var req_user = req.params.user;
  if (!req_user) res.send('Can not get the requested user');
  Profile.findOne({ username: req.user.username }).exec((err, user) => {
    if (err) res.send('Can not find the requested user');
    else {
      res.send({ username: req.user.username, following: user.followers });
    }
  });
};

const addFollower = (req, res) => {
  var new_follower = req.params.user;

  Profile.findOne({ username: req.user.username }).exec((err, user) => {
    if (err) {
      res.send('Query Error');
    } else {
      //add the follower
      Profile.find({ username: new_follower }).exec((err, profile) => {
        if (!profile) {
          res.send({ error: '1', msg: 'Does not exist such user' });
        } else if (user.followers.indexOf(new_follower) > -1) {
          res.send({ error: '1', msg: 'The follower already exists' });
        } else if (new_follower == req.user.username) {
          res.send({
            error: '1',
            msg: 'The followers can not include yourself'
          });
        } else {
          user.followers.push(new_follower);
          user.save(() => {
            res.send({
              username: new_follower,
              following: user.followers,
              error: '0',
              msg: ''
            });
          });
        }
      });
    }
  });
};

const deleteFollower = (req, res) => {
  var delete_follower = req.params.user;
  Profile.findOne({ username: req.user.username }).exec((err, user) => {
    if (err) {
      res.status(500).send('Query Error');
    } else {
      if (user.followers.indexOf(delete_follower) < 0) {
        res.send('The follower does not exists');
        return;
      }
      console.log('The deleted follower is ' + delete_follower);
      console.log('Before: ' + user.followers);
      user.followers = user.followers.filter(follower => {
        return follower != delete_follower;
      });
      console.log('Remain: ' + user.followers);
      user.save(err => {
        if (err) res.status(500).send('Can not save the followers');
        res.send({ username: delete_follower, following: user.followers });
      });
    }
  });
};

exports.setup = app => {
  app.get('/following/:user?', auth.isLoggedIn, getFollowers);
  app.put('/following/:user', auth.isLoggedIn, addFollower); //done
  app.delete('/following/:user', auth.isLoggedIn, deleteFollower);
};
