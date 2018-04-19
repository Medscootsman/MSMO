angular.module('userService', [])
    .factory('User', function ($http) {
        var factory = {};

        // retrieves all teams from the database.
        var user = {};

        //this gets 1 user
        user.get = function (id) {
            return $http.get('/api/users/' + id);
        };

        return user;
    });
