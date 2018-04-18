class Race {
  constructor(length, complexity, laps,) {
    this.participants = []
    this.length = length;
    this.complexity = complexity;
    this.laps = laps
  }

  calculateCarEfficiency(car, complexity) {
    //this is all the levels multiplied the divided by the car's weight and complexity of the track.
    var efficiency = (car.gearboxLevel * car.engineLevel * car.bodyLevel * car.tyreType) / (car.weight) * (complexity + length);
    return efficiency;
  }

  calculateErrorChance(experience) {

    //A random chance of the driver making a mistake which will reduce efficiency.
    var mistakechance = Math.floor(Math.random() * 100) - experience;
    return mistakechance;

  }

  reduceEfficiency(eff) {

      //reduce the efficiency if a mistake has occured.
      var newEff = eff - (Math.floor(Math.random() * 25));
      return newEff;
  }

  addParticipant(participant) {
      this.participants.push(particpant);
  }

  doRace() {
    var currentlap = 0;
    var efficiencies = [];
    while (currentlap < this.laps) {
        efficiencies = [];
        for (var i = 0; i < participants.length; i++) {

            //calculate the error and the efficiency
            var eff = calculateCarEfficiency(participant[i].car, this.complexity);
            var error = calculateErrorChance(participant[i].experience);

            //generate a random number and compare it against error.
            var rand = Math.floor(Math.random() * 100);

            if (rand > error) {
                err = reduceEfficiency(eff);
            }

            efficiencies.push([partipants[i].id, err]);
        }

        //resort who's got the highest efficiency.
        efficiencies.sort(function (a, b) {
            return a[1] - b[1];
        });
        currentlap++;
}
      //return the winner only for now so we know that it works.
    return efficiencies;
  }
}

module.exports = Race;
