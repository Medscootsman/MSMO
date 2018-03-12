var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

//User Schema
var Driverschema = new Schema({
  fname: String,
  sname: String,
  age: Number,
  Car: {type: Schema.Types.ObjectId, requred: true; unique: true};
  carLevel: Number,
});

module.exports("driver", Driverschema);
