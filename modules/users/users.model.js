const { default: mongoose } = require("mongoose");

const usersSchema = new mongoose.Schema({
username:  {
    type:  String,
    
    trim: true,
    unique: true
},
password: {
    type: String,
    required: true, 
    sesect: false
},
role: {
    type: String,
    enum: ["admin", "teacher"],
    
}
})

exports.UserModel = mongoose.model("User", usersSchema)