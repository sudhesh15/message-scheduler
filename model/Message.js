const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const MeswsageSchema = new Schema({
    message :String,
    day: String,
    time: String,
}, {
  timestamps: true,
});

const MessageModel = model('Message', MeswsageSchema);
module.exports = MessageModel;