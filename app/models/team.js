var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeamSchema = new Schema({
  name: String,
  carID: {type : Schema.Types.ObjectId, required: true, unique: true },
  crewLevel: Number,
  playerID: {type : Schema.Types.ObjectId, required: true, unique: true },
})

module.exports = mongoose.model('Team', TeamSchema);
