const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConnectionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("Connection", ConnectionSchema);