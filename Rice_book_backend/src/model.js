var mongoose = require('mongoose');
require('./db.js');
//user schema
var userSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hash: String,
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  }
});

var profileSchema = new mongoose.Schema({
  facebookId: String,
  username: String,
  display_name: String,
  email_address: String,
  phone_number: String,
  DOB: Date,
  zipcode: String,
  status: String,
  avatar: String,
  followers: [String],
  auth: []
});

var commentSchema = new mongoose.Schema({
  commentId: String,
  author: String,
  text: String,
  date: Date
});

var postSchema = new mongoose.Schema({
  _id: String,
  author: String,
  image: String,
  text: String,
  date: Date,
  comments: [commentSchema]
});

exports.User = mongoose.model('users', userSchema);
exports.Profile = mongoose.model('profiles', profileSchema);
exports.Post = mongoose.model('posts', postSchema);
exports.Comment = mongoose.model('comments', commentSchema);
