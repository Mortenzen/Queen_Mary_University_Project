var mongoose = require('mongoose');
var userSchema = mongoose.Schema;

var schema = new userSchema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  hash: String,
  location: String
},
 { collection : 'user-data' });

module.exports = mongoose.model('User', schema);
