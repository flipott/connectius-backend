const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model("Request", RequestSchema);