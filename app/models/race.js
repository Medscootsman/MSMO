var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var RaceLogic = require(".public/js/racelogic.js");
var Team = require("team.js");
var Circuit = require('circuit.js');
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

mongoose.connect("mongodb://MLyne:Rhynieman@cluster0-shard-00-00-f4zum.mongodb.net:27017,cluster0-shard-00-01-f4zum.mongodb.net:27017,cluster0-shard-00-02-f4zum.mongodb.net:27017/msmo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");

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
        Team.findById(race.teams[i], function (err. team) {
            racelogic.addParticipant(team);
        });

        var results = racelogic.doRace();

        //get the winning team.
        var winner = results[0][0];

        //get second place
        var second = results[1][0];
        console.log(winner);
        var third = results[2][0];
        
    }

}

module.exports = mongoose.model('Race', RaceSchema);
