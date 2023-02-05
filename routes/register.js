const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require('dotenv').config()

// Create a user
router.post("/", (req, res, next) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    }).save((err, results) => {
        if (err) {
            return next(err);
        }
        res.json(results);
    });
});

module.exports = router;