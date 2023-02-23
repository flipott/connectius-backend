const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fs = require("fs");

const defaultProfilePicturePath = __dirname + '/usertemp.png';
const defaultProfilePictureType = 'image/png';


const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: {
        data: {
          type: Buffer,
          default: fs.readFileSync(defaultProfilePicturePath)
        },
        contentType: {
          type: String,
          default: defaultProfilePictureType
        }
      },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    connections: [{ type: Schema.Types.ObjectId, ref: "User" }],
    requests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    liked: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);