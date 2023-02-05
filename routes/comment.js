const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = require("express").Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require('dotenv').config()


// user/:userId/post/:postId/comment

// Get comments 
router.get("/", (req, res, next) => {
    // Get all comments from a post
    if (req.params.userId && req.params.postId) {
        Comment.find({ originalPost: req.params.postId }, (err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        });
    } else if (!req.params.userId && !req.params.postId) {
    // Get all comments
        Comment.find({}, (err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        });
    }
    res.json("Invalid request");
});

// Create comment
router.post("/", (req, res, next) => {
    if (req.params.userId && req.params.postId) {
        const comment = new Comment({
            originalPost: mongoose.Types.ObjectId(req.params.postId),
            user: mongoose.Types.ObjectId(),
            body: req.body.body,
        });
    }
});

// // Create post
// router.post("/", (req, res, next) => {
//     if (req.params.userId) {
//         const post = new Post({
//             user: mongoose.Types.ObjectId(req.params.userId),
//             body: req.body.body,
//         }).save((err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             User.findByIdAndUpdate(
//                 req.params.userId,
//                 { $push: { posts: results._id } },
//                 { new: true },
//                 (userErr, userResults) => {
//                     if (userErr) {
//                         return next(userErr);
//                     }
//                     res.json(userResults);
//                 }
//             );
//         });
//     }
// });



// const CommentSchema = new Schema({
//     originalPost: { type: Schema.Types.ObjectId, ref: "Post" },
//     user: { type: Schema.Types.ObjectId, ref: "User" },
//     body: { type: String, required: true },
//     time: { type: Date, default: Date.now },
// });

// // Get posts
// router.get("/", (req, res, next) => {
//     // If getting specific user posts
//     if (req.params.userId) {
//         Post.find({ user: req.params.userId }, (err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             res.json(results);
//         });
//     } else {
//     // If getting all posts
//         Post.find({}, (err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             res.json(results);
//         });
//     }
// });

// // Get specific post
// router.get("/:postId", (req, res, next) => {
//     if (req.params.userId) {
//         Post.find({ _id: req.params.postId, user: req.params.userId }, (err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             res.json(results);
//         });
//     } else {
//         res.json("Must have user ID in URI");
//     }
// })

// // Create post
// router.post("/", (req, res, next) => {
//     if (req.params.userId) {
//         const post = new Post({
//             user: mongoose.Types.ObjectId(req.params.userId),
//             body: req.body.body,
//         }).save((err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             User.findByIdAndUpdate(
//                 req.params.userId,
//                 { $push: { posts: results._id } },
//                 { new: true },
//                 (userErr, userResults) => {
//                     if (userErr) {
//                         return next(userErr);
//                     }
//                     res.json(userResults);
//                 }
//             );
//         });
//     }
// });

// // Delete post
// router.delete("/:postId", (req, res, next) => {
//     if (req.params.userId) {
//         Post.findByIdAndDelete(req.params.postId, (err, results) => {
//             if (err) {
//                 return next(err);
//             } else if (results) {
//                 User.findByIdAndUpdate(
//                     req.params.userId,
//                     { $pull: { posts: results._id } },
//                     { new: true},
//                     (userErr, userResults) => {
//                         if (userErr) {
//                             return next(userErr);
//                         }
//                         res.json(userResults);
//                     }
//                 );
//             } else {
//                 res.json("Could not find post");
//             }

//         });
//     }
// });

module.exports = router;