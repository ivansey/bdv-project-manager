let mongoose = require('mongoose');

let newsCommentsSchema = new mongoose.Schema ({
    idNews: String,
    idUser: String,
    text: String,
    firstName: String
});

let newsCommentsModel = mongoose.model("newsComments", newsCommentsSchema);

module.exports = newsCommentsModel;