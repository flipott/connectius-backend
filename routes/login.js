const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require('dotenv').config();

router.post("/", (req, res, next) => {
    User.find({ email: req.body.email }, (err, results) => {
        if (err) {
            return next(err);
        }
        if (!results.length) {
            // User does not exist
            return res.status(400).json({ errors: [{"msg": "Incorrect email address"}]})
        } else {
            const user = { id: results[0]._id };
            // User exists
            bcrypt.compare(req.body.password, results[0].password, (err, pasRes) => {
                if (err) {
                    return next(err);
                }
                if (pasRes) {
                    // Passwords match
                    const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "10m" });
                    res.json({
                        token: token,
                        user: user.id
                    });
                } else {
                    // Passwords do not match
                    return res.status(400).json({ errors: [{"msg": "Incorrect password"}]});
                }
            });
        }
    });
});

module.exports = router;