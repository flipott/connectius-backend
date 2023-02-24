const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const router = require("express").Router({ mergeParams: true });
const jwt = require("jsonwebtoken");
const verifyUser = require("../middleware/verifyUser");
require('dotenv').config()

// Get posts
router.get("/", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
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
            } else if (req.query.userList) {
            // If getting all posts from certain users
                Post.find({ user: { $in: req.query.userList }})
                    .populate("user")
                    .sort({ time: -1 })
                    .exec((err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                });
            } else if (req.query.postList) {
            // If getting all liked posts from certain users
                Post.find({ _id: { $in: req.query.postList }})
                .populate("user")
                .sort({ time: -1 })
                    .exec((err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                })
            }
        }
    });
});

// Get specific post
router.get("/:postId", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
            if (req.params.userId) {
                Post.find({ _id: req.params.postId, user: req.params.userId }, (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                });
            } else {
                res.json("YEP.");
            }
        }
    });
});

// Create post
router.post("/", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
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
        }
    });
});

// Delete post
router.delete("/:postId", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
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
        }
    });
});

// Add like to post and user
router.post("/:postId/like", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
            Post.findById(req.params.postId, (err, results) => {
                if (err) {
                    return next(err);
                }
                const postLikes = results.likes;
                if (!postLikes.includes(req.body.currentUser)) {
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
                }
            });
        }
    });
});

// Remove like from post and user
router.delete("/:postId/like", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(403);
        } else {
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
        }
    });
});

module.exports = router;