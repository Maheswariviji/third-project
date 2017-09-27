const mongoose = require('mongoose');
var chatSchema = mongoose.Schema({
fromUserId:{type:String},
toUserId:{type:String},
fromUserName:{type:String},
toUserName:{type:String},
message:{type:String},
date:{type:String} 
});
module.exports = mongoose.model('Chat', chatSchema);