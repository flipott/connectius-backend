const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    originalPost: { type: Schema.Types.ObjectId, ref: "Post" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);