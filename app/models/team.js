var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeamSchema = new Schema({
  name: {type: String, required: true},
  experience: {type: Number, required: true},
  driverID: {type : Schema.Types.ObjectId, required: false},
  crewLevel: {type: Number, required: true},
  playerID: {type : Schema.Types.ObjectId, required: true,},
  cash: Number,
})

module.exports = mongoose.model('Team', TeamSchema);
