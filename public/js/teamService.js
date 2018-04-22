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

    .factory('Circuits', function ($http) {

        var circuits = {};

        circuits.get = function (id) {
            return $http.get('/api/circuits' + id);
        };

        return circuits;
    });
