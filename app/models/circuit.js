var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CircuitSchema = new Schema({
  name: String,
  complexity: Number,
  maxPlayers: Number,
  maxLaps: Number,
  Countrycode: Number,
});

module.exports = mongoose.model('Circuit', UserSchema);
