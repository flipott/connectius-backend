const User = require("../models/user");
const postRoute = require("./post");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/verifyUser");
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
            User.findByIdAndUpdate(
                req.params.userId,
                { $push: { requests: req.body.currentUser }},
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
    User.findByIdAndUpdate(
        req.params.userId,
        { $push: { connections: req.body.recipient },
          $pull: { requests: req.body.recipient }
        },
        { new: true },
        (err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.body.recipient,
                { $push: { connections: req.params.userId },
                  $pull: { requests: req.params.userId }
                },
              { new: true },
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

// Get specific user
router.get("/:userId", (req, res, next) => {
    User.find({_id: req.params.userId})
        .populate("requests")
        .populate("connections")
        .populate([{
            path: 'posts',
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