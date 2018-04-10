const express = require('express');
var path = require('path');
var mongoose = require('mongoose');
const app = express();
var router = express.Router();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var User = require('./app/models/user.js');
var Car = require("./app/models/car.js");
var Driver = require("./app/models/driver.js");
var Team = require("./app/models/team.js");
var RaceLogic = require(".public/js/racelogic.js");
var Circuit = require("./app/models/circuit.js");
var Race = require("./app/models/race.js");

//sockets
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

router.get('/', function(req, res) {
	res.json({ message: 'you are at the route of the API' });
  console.log("hi");
});

//use the public files.
app.use(express.static('public'));

router.use(function(req, res, next) {
  console.log("Request type " + req.method + " detected. \n IP: " +
							req.ip + "\n route: " + req.originalUrl);
  next();
});

//connect to our Database
mongoose.connect("mongodb://MLyne:Rhynieman@cluster0-shard-00-00-f4zum.mongodb.net:27017,cluster0-shard-00-01-f4zum.mongodb.net:27017,cluster0-shard-00-02-f4zum.mongodb.net:27017/msmo?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin");

//middleware routing function.

//USERS
router.route('/users')

  .post(function(req, res) {
	//get inputs for the user
    var reqname = req.body.personName;
    var requsername = req.body.username;
    var reqpassword = req.body.password;

	var user = new User({personName: reqname, username: requsername, password: reqpassword});
	user.save(function(err) {
      if(err) {
        //if it's a duplicate user
        if (err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});

        else
					return res.send(err);
      }

      //return success message
      res.json("user created!");
			console.log("a new user called " + user.username + " has been created");
    });
  })

  .get(function(req, res) {
    User.find(function (err, users) {
      if(err) return res.send(err);

      //else return the users
      res.json(users);
    })
    });

//TEAMS
router.route('/teams')

  .get(function(req, res) {
    Team.find(function (err, teams)  {
      if(err) return res.send(err);

      //return the teams
      if(teams.length <= 0) {
        res.send("no teams have been added yet!");
      }
			else {
      	res.json(teams);
			}
    })
	})

	.post(function (req, res) {
		//you will need a player and a driver. Check either exist first.
		Driver.findById(req.body.dID, function(err, driver) {
			if(err) return res.send("No driver was present in the request");

			//now try to find the playerID
			User.findById(req.body.pID, function(err, user) {
				if(err) return res.send("No player was present in the request");

				//now that you have both driver and player, add a new team.
				var team = new Team();

				team.name = req.body.name;
				team.experience = 0;
				team.driverID = req.body.dID;
				team.crewLevel = 1;
                team.playerID = req.body.pID;
                team.cash = 0;

				team.save(function(err) {
						if(err) {
							return res.send(err);
						} else {
							res.send("team has been created");
							console.log("A new team called" + team.name + " has been created");
						}
				});
			})
		})
	})

	.put(function (req, res) {
		Team.findById(req.body.uID, function(err, team) {
			if(err) return res.send("No team to update");

			//otherwise update the team.

			if(req.body.name != "undefined") {
				team.name = req.body.name;
			}

			if(req.body.exp != "undefined") {
				team.experience = req.body.exp;
			}

			if(req.body.crewlevel != "undefined") {
				team.crewLevel = req.body.crewlevel;
			}

			if(req.body.dID != "undefined") {
				team.driverID = req.body.dID;
			}

			if(req.body.pID != "undefined") {
				team.driverID = req.body.pID;
            }

            if (req.body.experience != "undefined") {
                team.experience += req.body.experience;
            }

            if (req.body.cash != "undefined") {
                team.cash += req.body.cash;
            }

			team.save(function(err) {
				if(err) {
					return res.send(err);
				}

				else {
					res.send("Team updated!");
				}
			});

		})
	});


//get the team
router.route('teams/:playerid')
	.get(function(req, res) {
		Team.find({playerID: req.params.playerid}, function(err, team) {
			if(err) return res.send("team was not found");

			//otherwise, return the team.
			res.send(team);
		})
	});

//get specific User
router.route('/users/:userid')
.get(function(req, res) {
	User.findById(req.params.userid, function(err, user) {
		if (err) return res.send("User was not found");

		// return that user
		res.json(user);
	})
})

.delete(function(req, res) {
	User.remove({_id: req.params.user_id }, function(err, user) {
		if (err) return res.send(err);

		res.json({ message: 'Successfully deleted' });
	});
});

router.route('/user/:username')
.get(function(req, res) {
	User.find({username: req.params.username}, function(err, user) {
		if (err) return res.send("User was not found");

		// return that user
		res.json(user);
	});
    });

router.route('/teams/cash/add')
    .put(function (req, res) {
        Team.findById(req.body.teamid, function (err, team) {
            if (err) return res.send("Team was not found");

            team.cash += req.params.reward;

            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("$" + req.params.cash + " was awarded");
                }
            });
          
           
        });
    });

router.route('/teams/cash/purchase')
    .post(function (req, res) {
        Team.findById(req.body.teamid, function (err, team) {
            if (err) return res.send("Team was not found");

            //check if the team has enough money.
            var deduction = team.cash - req.body.itemCost;

            if (deduction < 0) {
                res.statusCode(403);
                return res.send("You do not have enough money for that item.");
            }

            team.cash - req.body.itemCost;

            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("Purchase successful");
                }
            });


        });
    });
router.route('/teams/experience')
    .put(function (req, res) {
        Team.findById(req.body.teamid, function (err, team) {
            if (err) return res.send("Team was not found");

            team.experience += req.body.experience;
            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("team was awarded " + req.body.experience + " exp");
                }
            });
            
        });
    });

//Upgrading the team's level.
router.route('/teams/upgrade/crew')
    .put(function (req, res) {
        Team.findById(req.body.teamid, function (err, team) {
            if (err) return res.send("Team was not found");

            team.crewLevel += 1;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("Your teams crew has been upgraded by 1!");
                }
            });
        });
    });

//CARS (UPGRADES)
router.route('/cars/upgrade/gearbox')
    .put(function (req, res) {
        Car.findById(req.body.carid, function (err, car) {
            if (err) return res.send("Car was not found");

            car.gearboxLevel += 1;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("car's gearbox was upgraded!");
                }
            });
        });
    });

router.route('/cars/upgrade/engine')
    .put(function (req, res) {
        Car.findById(req.body.carid, function (err, car) {
            if (err) return res.send("Car was not found");

            car.engineLevel += 1;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("car's engine was upgraded!");
                }
            });
        });
    });

router.route('/cars/upgrade/body')
    .put(function (req, res) {
        Car.findById(req.body.carid, function (err, car) {
            if (err) return res.send("Car was not found");

            car.bodyLevel += 1;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("car's body was upgraded!");
                }
            });
        });
    });


router.route('/cars/upgrade/tyre')
    .put(function (req, res) {
        Car.findById(req.body.carid, function (err, car) {
            if (err) return res.send("Car was not found");

            car.bodyLevel += req.body.tyreType;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("car's tyre was upgraded!");
                }
            });
        });
    });

router.route('/cars/upgrade/weight')
    .put(function (req, res) {
        Car.findById(req.body.carid, function (err, car) {
            if (err) return res.send("Car was not found");

            car.weight - req.body.weight;

            car.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("car's tyre was upgraded!");
                }
            });
        });
    });



//DRIVERS
router.route('/drivers')

  .get(function(req, res) {
    Driver.find(function(err, drivers) {

      if(err) return res.send("driver not found");

      if(drivers.length <= 0) {
        res.send("There is no drivers in the system!");
      }
      else
      {
      	res.json(drivers);

      }
    });
    })

	.post(function(req, res) {
			var driver = new Driver();
			var car = new Car();
			car.name = req.body.name;
			car.weight = 100 //all cars have a starting weight of x
			car.gearboxLevel = Math.floor(Math.random() * 5);
			car.tyreType = 1;
			car.engineLevel = Math.floor(Math.random() * 5);
			car.bodyLevel = Math.floor(Math.random() * 5);

			driver.forename = req.body.forename;
			driver.surname = req.body.surname;
			driver.age = Math.floor((Math.random() * 20) + 1) + 18;
			driver.car = car._id;
			driver.carLevel = 1;

			car.save(function(err) {
				if(err) {
					return res.send(err);
				}
			});

			driver.save(function(err) {
	            if(err) {
					return res.send(err);
	            }
	      //return success message
				console.log("a new driver called " + driver.forename + " has been registered with the system.");
				res.send("driver and car created!")
	    });
	});

//CIRCUITS
router.route('/circuits')

    .get(function (req, res) {
        Circuit.find(function (err, circuits) {

            if (err) return res.send("ciruit not found");

            if (circuits.length <= 0) {
                res.send("There is no circuits in the system!");
            }
            else {
                res.json(circuits);

            }
        });
    })
    .post(function (req, res) {
        var circuit = new Circuit();

        circuit.name = req.body.name;
        circuit.complexity = req.body.complexity;
        circuit.maxPlayers = req.body.maxPlayers;
        circuit.maxLaps = req.body.maxLaps;
        circuit.Countrycode = req.body.countryCode;

        circuit.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Circuit " + circuit.name + " was added");
            }
        });
    });
router.route("/races")
    .get(function (req, res) {
        Race.find(function (err, races) {
            if (err) return res.send(err);

            if (races.length < 0) {
                return res.send("There are no races in the system");
            }
            else {
                res.json(races)
            }
        });
    })

    .post(function (req, res) {
        var race = new Race();
        race.name = req.body.name;
        race.startDate = req.body.date;
        race.participants = 0;
        race.laps = req.body.laps;
        race.circuit = req.body.circuitid;

        race.save(function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Race " + race.name + " was added");
            }
        });
    });

router.route("/races/:raceid/addteam/:teamid")
    .put(function (req, res) {
        Team.findById(req.params.teamid, function(err, team) {
            if (err) return res.send(err);
            Race.
        }
    }

//root of the application.
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.get('/szechuansauce', function(req, res) {
    res.send("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/62pcXHTHGy8\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>")
    console.log("I'M PICKLE RIIIICK!");
		//var rick = new Audio('sound/pickler_rick.mp3');
		//rick.play();
});

app.get('/login', function(req, rest) {
  res.sendFile(__dirname + "/login.html")
});

io.on('connection', function (socket) {
    console.log('user has connected');

});

app.use("/api", router);

app.listen(3000, () => console.log('MSMO Online'));
