var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

//car Schema

var CarSchema = new Schema({
  name: String,
  weight: {type: Number, required: true},
  gearboxLevel: {type: Number, required: true},
  tyreType: {type: Number, required: true},
  engineLevel: {type: Number, required: true},
  bodyLevel: {type: Number, required: true},
});

module.exports = mongoose.model('Car', CarSchema);
