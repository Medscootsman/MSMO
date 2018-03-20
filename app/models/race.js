var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var RaceSchema = new Schema({
    name: String,
    startDate: Date,
    participants: Number,
    laps: Number,
    circuit: {
        type: Schema.Types.ObjectId,
        ref: 'Circuit'
    },

});

module.exports = mongoose.model('Race', RaceSchema);
