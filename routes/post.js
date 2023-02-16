const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = require("express").Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const auth = require("../middleware/verifyUser");
require('dotenv').config()

// Get posts
router.get("/", (req, res, next) => {
    // If getting specific user posts
    if (req.params.userId) {
        Post.find({ user: req.params.userId })
        .populate("user")
        .sort({ time: -1 })
        .exec((err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        });
    } else {
    // If getting all posts
        Post.find({ user: { $in: req.query.userList }})
            .populate("user")
            .sort({ time: -1 })
            .exec((err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        })
    }
});

// Get specific post
router.get("/:postId", (req, res, next) => {
    if (req.params.userId) {
        Post.find({ _id: req.params.postId, user: req.params.userId }, (err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        });
    } else {
        res.json("Must have user ID in URI");
    }
})

// Create post
router.post("/", (req, res, next) => {
    console.log(req);
    if (req.params.userId) {
        const post = new Post({
            user: mongoose.Types.ObjectId(req.params.userId),
            body: req.body.body,
        }).save((err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.params.userId,
                { $push: { posts: results._id } },
                { new: true },
                (userErr, userResults) => {
                    if (userErr) {
                        return next(userErr);
                    }
                    res.json(userResults);
                }
            );
        });
    }
});

// Delete post
router.delete("/:postId", (req, res, next) => {
    if (req.params.userId) {
        Post.findByIdAndDelete(req.params.postId, (err, results) => {
            if (err) {
                return next(err);
            } else if (results) {
                User.findByIdAndUpdate(
                    req.params.userId,
                    { $pull: { posts: results._id } },
                    { new: true},
                    (userErr, userResults) => {
                        if (userErr) {
                            return next(userErr);
                        }
                        res.json(userResults);
                    }
                );
            } else {
                res.json("Could not find post");
            }

        });
    }
});

// Add like to post and user
router.post("/:postId/like", (req, res, next) => {
    Post.findByIdAndUpdate(
        req.params.postId,
        { $push: { likes: req.body.currentUser }},
        { new: true },
        (err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.body.currentUser,
                { $push: { liked: results._id }},
                {new: true },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                }
            );
        }
    );
});

// Remove like from post and user
router.delete("/:postId/like", (req, res, next) => {
    Post.findByIdAndUpdate(
        req.params.postId,
        { $pull: { likes: req.body.currentUser }},
        { new: true },
        (err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.body.currentUser,
                { $pull: { liked: results._id }},
                {new: true },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                }
            );
        }
    );
});

module.exports = router;