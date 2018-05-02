angular.module('teamService', [])
    .factory('Teams', function ($http) {
        var factory = {};

        // retrieves all teams from the database.
        var teams = {};

        //this gets everything
        teams.all = function () {
            return $http.get('/api/teams');
        };

        return teams;
    })

    .factory('Races', function ($http) {
        var factory = {};

        // retrieves all teams from the database.
        var races = {};

        //this gets everything
        races.all = function () {
            return $http.get('/api/races');
        };

        return races;
    })
	
	.factory('awardSystem', function ($http) {
        var system = {};
		system.reward = function (id, award, giventoken) {
            return $http.put('api/teams', {
                uid: id,
                cash: award,
				token: giventoken,
            });
        };
        return system;
    })

    .factory('Purchase', function ($http) {

        // retrieves all teams from the database.
        var purchase = {};

        //this gets everything
        purchase.buy = function (givenusername, givencost, giventoken) {

            return $http.post('api/teams/cash/purchase', {
                username: givenusername,
                itemCost: givencost,
                token: giventoken,
                cache: true,
            }).then(function (data) {
                return (data);
            })
        };

        return purchase;
    })

    .factory("FindTeam", function ($http) {
        var find = {};
        find.get = function (givenusername, giventoken) {
            return $http.post('api/teams/find', {
                username: givenusername,
                token: giventoken
            }).then(function (data) {
                return data;
            })
        }
        return find;
    })

    .factory("FindDriver", function ($http) {
        var find = {};
        find.get = function (givenid, giventoken) {
            return $http.post('api/driver/find', {
                did: givenid,
                token: giventoken
            }).then(function (data) {
                return (data);
            });
        }
        return find;
    })

    //upgrades

    .factory('CrewUpgrade', function ($http) {
        var upgrade = {};

        upgrade.buy = function (givenusername, giventoken) {
            return $http.put('api/teams/upgrade/crew', {
                username: givenusername,
                token: giventoken
            });
        }
        return upgrade;
    })

    .factory('EngineUpgrade', function ($http) {
        var upgrade = {};

        upgrade.buy = function (givenid, giventoken) {
            return $http.put('api/cars/upgrade/engine', {
                carid: givenid,
                token: giventoken
            });
        }
        return upgrade;
    })

    //upgrades

    .factory('GearboxUpgrade', function ($http) {
        var upgrade = {};

        upgrade.buy = function (givenid, giventoken) {
            return $http.put('api/cars/upgrade/gearbox', {
                carid: givenid,
                token: giventoken
            });
        }
        return upgrade;
    })

    .factory('TyreUpgrade', function ($http) {
        var upgrade = {};

        upgrade.buy = function (givenid, giventoken) {
            return $http.put('api/cars/upgrade/tyre', {
                carid: givenid,
                token: giventoken
            });
        }
        return upgrade;
    })

    .factory('BodyUpgrade', function ($http) {
        var upgrade = {};

        upgrade.buy = function (givenid, giventoken) {
            return $http.put('api/cars/upgrade/body', {
                carid: givenid,
                token: giventoken
            });
        }
        return upgrade;
    })

    .factory('Car', function ($http) {
        var car = {};

        car.get = function (givenid, token) {


            return $http.get('api/cars/' + givenid, {

                //set the header 
                headers: {
                    'Authorization': token,
                }
            });
        }
        return car;
    })

    .factory("doRace", function ($http) {
        var race = {};

        race.do = function () {
        }

        return race;
    })

    .factory("Practice", function ($http) {

        var practice = {};

        //Give the user a small amount of experience for doing a practice.
        practice.do = function(id, exp, giventoken) {
            return $http.put('/api/teams/experience', {
                teamid: id,
                experience: exp,
                token: giventoken
            });
        }

        return practice;
    })

    .factory('Circuits', function ($http) {

        var circuits = {};

        circuits.get = function (id) {
            return $http.get('/api/circuits' + id);
        };

        return circuits;
    });
