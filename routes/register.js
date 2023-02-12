const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/verifyUser");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require('dotenv').config()

// Create a user
router.post(
    "/",
    body("first-name").isLength({min: 2}).trim().escape()
    .withMessage("First name must be at least 2 characters long"),

    body("last-name").isLength({min: 2}).trim().escape()
    .withMessage("Last name must be at least 2 characters long"),

    body("email").isEmail().normalizeEmail()
    .withMessage("Email address must be a valid email"),

    body("password").isLength({min: 3})
    .withMessage("Password must be at least 3 characters long"),

    body("confirm-password").custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    (req, res, next) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()}); 
        }

        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            User.find({ email: req.body.email }, (err, results) => {
                if (err) {
                    return next(err);
                }
                if (!results.length) {
                    const user = new User({
                        firstName: req.body["first-name"],
                        lastName: req.body["last-name"],
                        email: req.body.email,
                        password: hashedPassword,
                    }).save((err, results) => {
                        if (err) {
                            return next(err);
                        }
                        res.json(results);
                    });
                } else {
                    return res.status(400).json({ errors: [{"msg": "Account already exists"}]});
                }
            });
        });
    }
);


module.exports = router;