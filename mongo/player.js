const mongoose = require('mongoose');

const playerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    descrim: String,
    avatar: String,
    addedTime: String,
    lastTime: String,
    rank: Number,
    level: Number,
    exp: Number
});

module.exports = mongoose.model("Player", playerSchema);