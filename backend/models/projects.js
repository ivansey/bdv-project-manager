let mongoose = require('mongoose');

let projectsSchema = new mongoose.Schema ({
    title: String,
    category: String,
    time: String,
    img: String,
    text: String,
    desc: String,
    textPlus: String,
    active: Boolean,
    phone: String,
    email: String,
    idUser: String,
    id: Number
});

let projectsModel = mongoose.model("projects", projectsSchema);

module.exports = projectsModel;
