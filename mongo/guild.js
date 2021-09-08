const mongoose = require('mongoose');

const guildrSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: String,
    name: String,
    addedTime: String,
    lastTime: String,
});

module.exports = mongoose.model("Guild", guildrSchema);