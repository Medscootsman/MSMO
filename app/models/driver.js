var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

//User Schema
var Driverschema = new Schema({
  forename: String,
  surname: String,
  age: Number,
  car: {type: Schema.Types.ObjectId, requred: true,},
  carLevel: Number,
})

module.exports = mongoose.model("Driver", Driverschema);
