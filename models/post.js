const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    time: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
    username: { type: String, required: true },
    comments: { type: Array, default: []},
});

module.exports = mongoose.model("Post", PostSchema);