let mongoose = require('mongoose');
let md5 = require('md5');

let usersSchema = new mongoose.Schema ({
    email: String,
    pass: String,
    firstName: String,
    lastName: String,
    type: String,
    balance: Number
});

usersSchema.method("getFullName", () => { return this.firtsName + " " + this.lastName });

usersSchema.method("setPass", (pass) => {
    this.pass = md5(pass);
});

usersSchema.method("validatePass", (pass) => {
    return this.pass === md5(pass);
});

let usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
