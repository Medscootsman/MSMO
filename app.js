var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
const app = express();
var router = express.Router();
var http = require('http')
var server = http.createServer(app);
var bodyParser = require("body-parser");
var User = require('./app/models/user.js');
var Car = require("./app/models/car.js");
var Driver = require("./app/models/driver.js");
var Team = require("./app/models/team.js");
var RaceLogic = require("./app/models/racelogic.js");
var Circuit = require("./app/models/circuit.js");
var Race = require("./app/models/race.js");
var jwt = require("jsonwebtoken");

//old chatnick array i was planning to use.
var chatnicks = [];

var teamids = [];
race = new RaceLogic(10, 2, 3);

var supersecret = "Mikeisatraitor"; //token secret,
//sockets
var io = require('socket.io').listen(server);

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

//connect to our Database
mongoose.connect("mongodb://localhost:27017/msmo");
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
                team.username = req.body.username;
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


//get a team
router.route('/teams/find')
	.post(function(req, res) {
        Team.findOne({
            username: req.body.username,
        }).exec(function(err, team) {
			if(err) return res.send("team was not found");

			//otherwise, return the team.
			res.json(team);
		})
    });

//get a car
router.route('/driver/find')
    .post(function (req, res) {
        Driver.findById(req.body.did, function (err, driver) {
            if (err) return res.send("driver was not found");

            //otherwise, return the team.
            console.log(driver);
            res.json(driver);
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
    .get(function (req, res) {
        User.find({ username: req.params.username }, function (err, user) {
            if (err) return res.send("User was not found");

            // return that user
            res.json(user);
        });
    });
router.route('/teams/cash/add')
    .put(function (req, res) {
        Team.findOne({
            username: req.body.username,
        }).select('cash').exec(function (err, team) {
            if (err) return res.send("Team was not found");
     
            team.cash += req.body.reward;

            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.json({
                        success: true,
                        message: "Award given: £" + req.body.reward,
                    })
                }
            });
        });

    });

router.route('/teams/cash/purchase')
    .post(function (req, res) {
        Team.findOne({
            username: req.body.username,
        }).select('cash').exec(function (err, team) {
            if (err) return res.send("team was not found");
            //check if the team has enough money.
            var deduction = team.cash - req.body.itemCost;

            if (deduction < 0) {
                res.statusCode(403);
                return res.send("You do not have enough money for that item.");
            }

            console.log(req.body.itemCost);
            console.log(team.cash);
            team.cash = team.cash - req.body.itemCost;
            console.log(team.cash);
            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.json({
                        success: true,
                        message: "purchase successful",
                    });
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
        Team.findOne({
            username : req.body.username
        }).select('crewLevel').exec(function(err, team) {
            if (err) return res.send("Team was not found");

            team.crewLevel += 1;

            team.save(function (err) {
                if (err) {
                    return res.send(err);
                }

                else {
                    res.send("Your teams crew has been upgraded by 1!");
                }
            });
        });
    });

//CARS (Getting just one);

router.route('/cars/:carID')
    .get(function (req, res) {
        Car.findById(req.params.carID, function (err, car) {
            if (err) return (err);
            res.json(car);
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
			car.weight = 100 //all cars have a starting weight of 100
			car.gearboxLevel = Math.floor(Math.random() * 5);
			car.tyreType = 1;
			car.engineLevel = Math.floor(Math.random() * 5);
			car.bodyLevel = Math.floor(Math.random() * 5);

			driver.forename = req.body.forename;
			driver.surname = req.body.surname;
			driver.age = Math.floor((Math.random() * 20) + 1) + 18;
			driver.car = car._id;
            driver.carLevel = 1;
            driver.cost = Math.floor((Math.random() * 0.6));

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

//races
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

//adding teams to races.
router.route("/races/:raceid/addteam/:teamid")
    .put(function (req, res) {

        //find the team first
        Team.findById(req.params.teamid, function (err, team) {

            if (err) return res.send(err);

            //then find the race next
            Race.findById(req.params.raceid, function (err, race) {

                if (err) return res.send(err);
                race.teams.push(team._id);

                race.save(function (err) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.send("team was added to race (" + team.name + ")");
                    }
                });
            });
        });
    });

router.route("/token/:token")
    .get(function (req, res) {
        jwt.verify(req.params.token, supersecret, function (err, decoded) {
            res.send(decoded);
        });
    });

//doing the race.
router.route("/races/:raceid/dorace/")
    .post(function (req, res) {
        //perform the race and return the winner to all affected parties.
        Race.findById(req.params.raceid, function (err, race) {
            //check if today is the day the race occurs.
            if (race.startDate.getTime() === Date.now()) {
                var winner = race.doRace();
            }

            race.remove(function (err) { //we don't need the race anymore.
               if(err) {
                   res.send(err);
               }
               else {
                   res.send("race successful");
               }
            });
        });
    });

//authentication.
router.route("/auth")
    .post(function (req, res) {
        
        User.findOne({
            username: req.body.username
        }).select('personName username password').exec(function (err, user) {
            if (err) throw err;
            
            //check if a user is present
            if (!user) {
                res.json({
                    success: false,
                    message: "username or password was incorrect",
                });
            } else if (user) {

                //password check
                var validpassword = user.comparePassword(req.body.password);
                
                if (!validpassword) {
                    res.json({
                        success: false,
                        message: "username or password was incorrect",
                    });
                } else {
                    //if user was found, and the password is correct, give the client a token.
                    var token = jwt.sign({

                        name: user.personName,
                        username: user.username,
                        id: user._id,

                    }, supersecret, {

                            expiresIn: '24h',

                        });

                    //return the token
                    res.json({

                        success: true,
                        message: "token created",
                        token: token,

                    });

                }
            }
        });
    });


//root of the application.
app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/portal/*', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


app.get('/szechuansauce', function(req, res) {
    res.send("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/62pcXHTHGy8\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>")
    console.log("I'M PICKLE RIIIICK!");
		//var rick = new Audio('sound/pickler_rick.mp3');
		//rick.play();
});

app.get('/registration', function (req, res) {
    res.sendFile(__dirname + "/registration.html")
});


io.on('connection', function (socket) {

    socket.on('new user', function (data, callback) {

        if (chatnicks.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            chatnicks.push(socket.username);
            io.sockets.emit('username', chatnicks);
        }
    });

    socket.on('send-message', function (data) {
        io.sockets.emit('new message', {msg: data.msg, nick: data.nick});
    });

    socket.on('disconnect', function (data) {
        console.log("disconnected");
        if (!socket.username) return;

        chatnicks.splice(chatnicks.indexOf(socket.username));

        io.sockets.emit('username', chatnicks);
    });

    socket.on('Race-Start', function (data) {

    });

    socket.on('join-race', function (data) {
        race.join(data);
        io.sockets.emit('race-joined', data.name);
    }

});

//router usage. Log when it is about to be used.
router.use(function (req, res, next) {

    console.log("A user has logged on");

    //check to see if the token is in the parameters, body or in the header.
    var token = req.body.token || req.query.token || req.headers["x-access-token"] || req.params.token;

    //decode the token we get.
    if (token) {
        //verifies the token
        jwt.verify(token, supersecret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: "Failed to authenticate token",
                });
            }
            else {
                //if all good say it is decoded.
                req.decoded = decoded;
                console.log("Request type " + req.method + " detected. \n IP: " +
                    req.ip + "\n route: " + req.originalUrl);
                next();
            }
        });
    }
    else {
        return res.status(403).send({
            success: false,
            message: "No token provided"
        });
    }
    
});
app.use("/api", router);

server.listen(3000, () => console.log('MSMO Online on port 3000'));
