var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var RaceLogic = require("./racelogic.js");
var Team = require("./team.js");
var Circuit = require('./circuit.js');
var RaceSchema = new Schema({
    name: String,
    startDate: Date,
    participants: Number,
    teams: [Schema.Types.ObjectId],
    laps: Number,
    circuit: {
        type: Schema.Types.ObjectId,
        ref: 'Circuit'
    },

});

mongoose.connect("mongodb://Medscootsman:Rhynieman@ds014578.mlab.com:14578/msmo");

RaceSchema.methods.doRace = function () {
    var race = this;
    var circuit;
    Circuit.findById(race.circuit, function (err, foundcircuit) {
        if (err) return null;
        var circuit = foundcircuit;
    });

    var racelogic = new RaceLogic(circuit.length, circuit.complexity, circuit.maxLaps);

    //add all teams as participants
    for (var i = 0; i < race.teams.length; i++) {

        //create objects for each team.
        Team.findById(race.teams[i], function (err, team) {
            racelogic.addParticipant(team);
        });
    }
    var results = racelogic.doRace();

    //get the winning team.
    var winner = results[0][0];

    //get second place
    var second = results[1][0];
    console.log(winner);
    var third = results[2][0];

    var winners = [winner, second, third];

    return winners;

}

module.exports = mongoose.model('Race', RaceSchema);
