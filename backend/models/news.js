let mongoose = require('mongoose');

let newsSchema = new mongoose.Schema ({
    title: String,
    time: String,
    img: String,
    youTube: String,
    text: String,
    desc: String
});

let newsModel = mongoose.model("news", newsSchema);

module.exports = newsModel;
