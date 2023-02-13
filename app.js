const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require('dotenv').config()

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const mongoDb = process.env.DB;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to Mongo DB"));
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });

app.use(express.json());
app.use(cors());


  

app.get("/", (req, res) => {
});



app.use("/user", routes.user);
app.use("/post", routes.post);
app.use("/comment", routes.comment);
app.use("/register", routes.register);
app.use("/login", routes.login);
app.use("/auth", routes.auth);

app.listen(port, () => console.log(`Server is currently running on port ${port}.`));