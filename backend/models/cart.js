let mongoose = require('mongoose');

let cartSchema = new mongoose.Schema ({
    idUser: String,
    idProject: String,
    phone: String,
    email: String,
    text: String
});

let cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
