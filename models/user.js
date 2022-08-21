const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// will add "passpord" and "username" fields in the model
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);