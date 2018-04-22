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

    .factory('EngineUpgrade', function ($http) {
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

    //purchase something from the server.

    .factory('Circuits', function ($http) {

        var circuits = {};

        circuits.get = function (id) {
            return $http.get('/api/circuits' + id);
        };

        return circuits;
    });
