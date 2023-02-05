const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
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

// Get specific user
router.get("/:userId", (req, res, next) => {
    User.find({_id: req.params.userId}, (err, results) => {
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

module.exports = router;