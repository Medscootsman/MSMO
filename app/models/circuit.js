var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  length: Number,
  maxPlayers: Number,
  maxLaps: Number,
  Countrycode: Number,
});

module.exports = mongoose.model('User', UserSchema);
