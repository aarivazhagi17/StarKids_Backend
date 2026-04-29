const mongoose = require("mongoose");
const newadmin = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true })

AdminRegister= mongoose.model("Admin", newadmin)

module.exports = AdminRegister