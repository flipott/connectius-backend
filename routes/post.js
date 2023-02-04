const Post = require("../models/post");
const commentRouter = require("./comment");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require('dotenv').config()

// // Get all posts
// router.get("/", (req, res) => {
//     Post.find({}, (err, results) => {
//         if (err) {
//             return next(err);
//         }
//         res.send(results);
//     });
// });

// // Create new post
// router.post("/", auth, (req, res, next) => {
//     jwt.verify(req.token, process.env.SECRET_KEY, (err, data) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             const post = new Post({
//                 title: req.body.title,
//                 body: req.body.body,
//                 username: req.body.username,
//             }).save((err, results) => {
//                 if (err) {
//                     return next(err);
//                 }
//                 res.send("Post successfully created.");
//             });
//         }
//     });
// });

// // Get specific post
// router.get("/:postId", (req, res, next) => {
//     Post.find({ _id: req.params.postId }, (err, results) => {
//         if (err) {
//             return next(err);
//         }
//         res.send(results);
//     });
// });

// // Update specific post
// router.put("/:postId", (req, res, next) => {
//     Post.findByIdAndUpdate(
//         req.params.postId,
//         {
//             title: req.body.title,
//             body: req.body.body
//         },
//         {safe: true, upsert: true, new : true},
//         (err, results) => {
//             if (err) {
//                 return next(err);
//             }
//             res.send("Successfully updated post.");
//         });
// });

// // Delete specific post
// router.delete("/:postId", (req, res, next) => {
//     Post.findByIdAndDelete(req.params.postId, (err, results) => {
//         if (err) {
//             return next(err);
//         }
//         res.send("Successfully deleted post.");
//     });
// });

module.exports = router;