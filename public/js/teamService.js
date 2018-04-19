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
});
