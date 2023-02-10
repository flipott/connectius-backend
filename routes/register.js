const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { check, body, sanitize } = require("express-validator");
require('dotenv').config()

// Create a user
router.post("/", (req, res, next) => {
    if (req.body.password !== req.body["confirm-password"]) {
        return res.status(401).json({error: "Passwords do not match"});
    }

    console.log(req.body);
    res.json("Works")
    // const user = new User({
    //     firstName: req.body.firstName,
    //     lastName: req.body.lastName,
    //     email: req.body.email,
    //     password: req.body.password,
    // }).save((err, results) => {
    //     if (err) {
    //         return next(err);
    //     }
    //     res.json(results);
    // });
});

module.exports = router;