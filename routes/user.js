const User = require("../models/user");
const Post = require("../models/post");
const postRoute = require("./post");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/verifyUser");
const Connection = require("../models/connection");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

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
        
        // Make sure user hasn't already received a request
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
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { requests: req.body.currentUser } },
        { new: true },
        (err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.body.currentUser,
                { $pull: { requests: req.params.userId } },
                { new: true },
                (err, results) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(results);
                }
            );
        }
    );
});

// Create Connections for users
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

// Remove Connections for users
router.delete("/:userId/connections", (req, res, next) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { connections: req.body.currentUser, requests: req.body.currentUser } },
        { new: true },
        (err, results) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate(
                req.body.currentUser,
                { $pull: { connections: req.params.userId, requests: req.params.userId } },
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

// Update user name
router.put("/:userId/name", 
    body("firstName").isLength({min: 2}).trim().escape()
    .withMessage("First name must be at least 2 characters long"),

    body("lastName").isLength({min: 2}).trim().escape()
    .withMessage("Last name must be at least 2 characters long"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()}); 
        }

        if (req.body.firstName) {
            User.findByIdAndUpdate(
                req.params.userId,
                { firstName: req.body.firstName, lastName: req.body.lastName },
                { new: true },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                }
            );
        } else {
            res.status(400).json({ errors: ["Invalid request"]});
        }
});

// Update user email
router.put("/:userId/email",
    body("email").isEmail().normalizeEmail()
    .withMessage("Email address must be a valid email"),
    (req, res, next) => {
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()}); 
        }
        if (req.body.email) {
            User.findByIdAndUpdate(
                req.params.userId,
                { email: req.body.email },
                { new: true },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                }
            );
        } else {
            res.status(400).json({ errors: ["Invalid request"]});
        }
});

// Update user password
router.put("/:userId/password",

    body("currentPassword").isLength({min: 3})
    .withMessage("Password must be at least 3 characters long"),

    body("newPassword").isLength({min: 3})
    .withMessage("Password must be at least 3 characters long"),

    body("confirmNewPassword").isLength({min: 3})
    .withMessage("Password must be at least 3 characters long"),

    body("confirmNewPassword").custom((value, {req}) => {
        if (value !== req.body.newPassword) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()}); 
        }
        if (req.body.newPassword) {
            User.findById(req.params.userId, (err, results) => {
                if (err) {
                    return next(err);
                }
                bcrypt.compare(req.body.currentPassword, results.password, (err, pasRes) => {
                    if (err) {
                        return next(err);
                    }
                    // Passwords match
                    if (pasRes) {
                        bcrypt.hash(req.body.newPassword, 10, (err, hashedPassword) => {
                            if (err) {
                                return next(err);
                            }
                            User.findByIdAndUpdate(
                                req.params.userId,
                                { password: hashedPassword },
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
        }
    }
);

// Delete a user
router.delete("/:userId", (req, res, next) => {
    User.findByIdAndDelete(req.params.userId, (err, results) => {
        if (err) {
            return next(err);
        }
        Post.remove({user: req.params.userId}, (err, results) => {
            if (err) {
                return next(err);
            }
            Post.updateMany(
                { likes: req.params.userId },
                { $pull: { likes: req.params.userId } },
                (err, results) => {
                    if (err) {
                        return next(err);
                    }
                    User.updateMany(
                        {
                            $or: [
                                { connections: req.params.userId },
                                { requests: req.params.userId} 
                            ]
                        },
                        { 
                            $pull: 
                            { connections: req.params.userId, requests: req.params.userId }
                        },
                        (err, results) => {
                            if (err) {
                                return next(err);
                            }
                            res.json(results);
                        }
                    );
                });
        });
    });
});

// Create user post
router.use("/:userId/post", postRoute);



module.exports = router;