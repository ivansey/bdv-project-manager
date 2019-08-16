let mongoose = require('mongoose');

let newsLikesSchema = new mongoose.Schema ({
    idNews: String,
    idUser: String
});

let newsLikesModel = mongoose.model("newsLikes", newsLikesSchema);

module.exports = newsLikesModel;
