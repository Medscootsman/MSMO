angular.module('userService', [])
    .factory('User', function ($http) {
        var factory = {};

        // retrieves all teams from the database.
        var user = {};

        //this gets 1 user
        user.get = function (id) {
            return $http.get('/api/users/' + id);
        };

        user.delete = function (id) {
            return $http.delete('api/users/' + id);
        };

        user.all = function () {
            return $http.get('api/users/');
        };

        return user;
    });
