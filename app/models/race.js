var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

var RaceSchema = new Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  participants: Number,
  laps: Number,
  Circuit: {type : Schema.Types.ObjectId, require: true, unique: true},

});

module.exports = mongoose.model('Race', RaceSchema);
