const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { data: Buffer, contentType: String },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    connections: [{ type: Schema.Types.ObjectId, ref: "Connection" }],
    requests: [{ type: Schema.Types.ObjectId, ref: "Request" }],
    liked: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);