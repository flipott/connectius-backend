const User = require("../models/user");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const verifyUser = require("../middleware/verifyUser");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require('dotenv').config();

router.get("/", verifyUser, (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET, (err, results) => {
        if (err) {
            res.status(200).send({"result": "false"})
        } else {
            res.status(200).send({"result": "true"})
        }
    });
});

module.exports = router;