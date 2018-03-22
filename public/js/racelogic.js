class Race {
  constructor(length, complexity, laps,) {
    this.participants = []
    this.length = length;
    this.complexity = complexity;
    this.laps = laps
    this.addCar = function(carObj) {
      this.participants.push(carObj);
    };
  }

  calculateCarEfficiency(car, complexity) {
    //this is all the levels multiplied the divided by the car's weight and complexity of the track.
    var efficiency = (car.gearboxLevel * car.engineLevel * car.bodyLevel) / (car.weight) * complexity;
    return efficiency;
  }

  calculateErrorChance(car, experience) {

    //A random chance of the driver making a mistake which will reduce efficiency.
    var mistakechance Math.floor(Math.Random() * 100) - experence;
    return mistakechance;

  }

  doRace() {

  }
}

module.exports = Race;
