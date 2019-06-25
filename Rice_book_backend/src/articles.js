const cookieParser = require('cookie-parser');

//import users collection
const User = require('./model.js').User;
const Profile = require('./model.js').Profile;
const Post = require('./model.js').Post;
const Comment = require('./model.js').Comment;

const auth = require('./auth.js');
const uploadCloudinary = require("../uploadCloudinary.js");

var allPosts = (res, req) => {
  var followers = [];
  var result = [];
  Profile.findOne({ username: req.user.username }).exec((err, profile) => {
    profile.followers.forEach(follower => {
      followers.push(follower);
    });
    // console.log(req.user.username);
    followers.push(req.user.username);
    Post.find({ author: { $in: followers } })
      .sort({ date: -1 })
      .exec((err, posts) => {
        // console.log(posts);
        posts.forEach(post => {
          result.push(post);
        });
        // console.log({ article: result });
        res.send({ article: result, msg: 'success' });
      });
  });
};
// A requested article, all requested articles by a user, or array of articles in the loggedInUser's feed
const getArticles = (req, res) => {
  var req_id = req.params.id;
  //check if the id is post_id or username
  if (!req_id) {
    var followers = [];
    var result = [];
    Profile.findOne({ username: req.user.username }).exec((err, profile) => {
      profile.followers.forEach(follower => {
        followers.push(follower);
      });
      // console.log(req.user.username);
      followers.push(req.user.username);
      Post.find({ author: { $in: followers } })
        .sort({ date: -1 })
        .exec((err, posts) => {
          for (let i = 0; i < posts.length; i++) {
            if (i <= 9) {
              result.push(posts[i]);
            }
          }
          // console.log({ article: result });
          res.send({ article: result });
        });
    });
  } else if (/^\d+$/.test(req_id) || /^\d+$/.test(-1 * req_id)) {
    // console.log(req_id);
    Post.findOne({ _id: req_id }).exec((err, post) => {
      var result = [];
      if (post == null) {
        res.send({ article: result });
      } else {
        result.push(post);
        res.send({ article: result });
      }
    });
  } else {
    Post.findOne({ author: req_id }).exec((err, post) => {
      var result = [];
      if (post == null) {
        res.send({ article: result });
      } else {
        result.push(post);
        res.send({ article: result });
      }
    });
  }
};

const putArticle = (req, res) => {
  var commentId = req.body.commentId;
  var text = req.body.text;
  var post_id = req.params.id;
  console.log(commentId);
  console.log(text);
  console.log(post_id);
  if (!post_id) {
    res.status(500).send('Can not get the post id');
  } else {
    //Update the specified article
    if (commentId == '') {
      Post.find({ _id: post_id }).exec((err, posts) => {
        if (posts.length > 0) {
          posts[0].text = text;
          posts[0].save(err => {
            if (err) res.status(500).send('Can not save the record');
            else {
              allPosts(res, req);
            }
          });
        } else {
          res.status(500).send('The author does not have the specified post');
        }
      });
    } else {
      //add the new comment
      if ((commentId == '-1')) {
        Post.findOne({ _id: post_id }).exec((err, post) => {
          var len = post.comments.length;
          var new_comment = new Comment({
            _id: len,
            author: req.user.username,
            text: text,
            date: new Date()
          });
          post.comments.push(new_comment);
          post.save(err => {
            if (err) res.status(500).send('Can not add the new comment');
            else allPosts(res, req);
          })
        })

      } else {
        //Update the specified comment
        console.log("editting");
        Post.find({ _id: post_id }).exec((err, posts) => {
          posts[0].comments.forEach((comment) => {
            if (comment._id == commentId) {
              console.log("before updating:");
              console.log(comment.text);
              console.log("new test is:");
              console.log(text);
              comment.text = text;
              comment.date = new Date;

            }
          });
          console.log(posts[0].comments[0].text);
          // for(let i = 0; i < posts[0].length; i++){
          //   if()
          // }
          posts[0].save(err => {
            if (err) res.status(500).send('Can not add the new comment');
            else {
              console.log(posts[0].comments[0].text);
              allPosts(res, req);
            }
          })
        })
      }
    }
  }
};

const postArticle = (req, res) => {
  var newPost;
  Post.find().exec((err, posts) => {
    if (err) res.status(500).send('Query Error');
    else {
      //asym
      newPost = new Post({
        _id: posts.length,
        author: req.user.username,
        image: req.body.image,
        text: req.body.text,
        date: new Date(),
        comments: []
      });
      newPost.save(err => {
        if (err) res.status(500).send('Can not save the new post');
        else allPosts(res, req);
      });
    }
  });
};

const postImage = (req, res) => {
  console.log(req.fileurl);
  console.log(req.fileid);
  console.log(process.env.CLOUDINARY_URL);
  res.send({ url: req.fileurl, id: req.fileid });
}


exports.setup = app => {
  app.get('/articles/:id?', auth.isLoggedIn, getArticles);
  app.put('/articles/:id', auth.isLoggedIn, putArticle);
  app.post('/article', auth.isLoggedIn, postArticle);
  app.post("/image", uploadCloudinary.uploadImage("title"), postImage);
};
