const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email required!!!!"],
    unique: true,
  },
});
userSchema.plugin(passportLocalMongoose); //아이디와 해싱+솔팅된 비번을 생성해준다.

module.exports = mongoose.model("User", userSchema);
