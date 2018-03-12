const express = require('express');
var path = require('path');
var mongoose = require('mongoose');
const app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var User = require('./app/models/user.js');
var Car = require("./app/models/car.js");
var Driver = require("./app/models/driver.js");
var Team = require("./app/models/team.js");

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
  console.log("app used");
  next();
});

//connect to our Database
mongoose.connect("mongodb://localhost:27017/msmo");

//middleware routing function.

//USERS
router.route('/users')

  .post(function(res, req) {
    var user = new User();
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

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
      res.json(teams);
    })
  });

//DRIVERS
router.route('/drivers')
  .get(function(req, res) {
    Driver.find(function (err, drivers) {
      if(err) return res.send(err);

      if(teams.length <= 0) {
        res.send("There is no drivers in the system!");
      }
      res.json(drivers);
    })
  });

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/szechuansauce', function(req, res) {
    res.send("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/62pcXHTHGy8\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>")
    console.log("I'M PICKLE RIIIICK!");
});

app.use("/api", router);

app.listen(3000, () => console.log('MSMO Online'));
