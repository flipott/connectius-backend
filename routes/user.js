const User = require("../models/user");
const postRoute = require("./post");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/verifyUser");
const Request = require("../models/request");
const Connection = require("../models/connection");
require('dotenv').config()

// CREATING USER IS IN ./REGISTER

// Get all users
router.get("/", (req, res, next) => {
    User.find({}, (err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
});

// Create Connection Request for user (recipient)
router.post("/:userId/request", (req, res, next) => {
    User.find({ _id: req.params.userId }, (err, results) => {
        if (err) {
            return next(err);
        }
        const userReqs = results[0].requests;
        if (userReqs.includes(req.body.currentUser)) {
            res.json(null);
        } else {
            const request = new Request( { user: req.body.currentUser }).save((err, result) => {
                if (err) {
                    return next(err)
                }
                User.findByIdAndUpdate(
                    req.params.userId,
                    { $push: { requests: result } },
                    { new: true },
                    (err, results) => {
                        if (err) {
                            return next(err);
                        }
                        res.json(results);
                    }
                );
            });
        }
    });
});

// Cancel Conntection Request for user (recipient)
router.delete("/:userId/request", (req, res, next) => {
    User.find({ _id: req.params.userId }, (err, results) => {
        if (err) {
            return next(err);
        }
        const userReqs = results[0].requests;
        if (!userReqs.includes(req.body.currentUser)) {
            res.json(null);
        } else {
            User.findByIdAndUpdate(
                req.params.userId,
                { $pull: { requests: req.body.currentUser } },
                { new: true },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                }
            );
        }
    });
});

// Accept Connection for a user
router.post("/:userId/connections", (req, res, next) => {
    const userConnection = new Connection({
        user: req.params.userId
    }).save((err, results) => {
        if (err) {
            return next(err);
        }
        User.findByIdAndUpdate(
            req.params.userId,
            { $push: { connections: results }, 
              $pull: { requests: req.body.recipient}
            },
            { new: true },
            (err, results) => {
                if (err) {
                    return next(err);
                }
                const recipientConnection = new Connection({
                    user: req.body.recipient
                }).save((err, results) => {
                    if (err) {
                        return next(err)
                    }
                    User.findByIdAndUpdate(
                        req.body.recipient,
                        { $push: { connections: results }, 
                          $pull: { requests: req.params.userId}
                        },
                        { new: true },
                        (err, finalResults) => {
                            if (err) {
                                return next(err);
                            }
                            res.json(finalResults);
                        }
                    );
                });
             }
        );
    });
});

// Get specific user
router.get("/:userId", (req, res, next) => {
    User.find({_id: req.params.userId})
        .populate([{
            path: 'posts',
            populate: {
                path: 'user'
            }
        }, {
            path: 'requests',
            populate: {
                path: 'user'
            } 
        }])
        .exec((err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
});

// Delete a user
router.delete("/:userId", (req, res, next) => {
    User.findByIdAndDelete(req.params.userId, (err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
});

// Create user post
router.use("/:userId/post", postRoute);



module.exports = router;