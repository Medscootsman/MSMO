angular.module('authService', [])
    .factory('Authtoken', function ($window) {
        // retrieves all teams from the database.
        var auth = {};

        //get the token out of local storage
        auth.getToken = function () {
            return $window.localStorage.getItem('token');
        };

        //sets the token.
        auth.setToken = function (token) {
            if (token)
                $window.localStorage.setItem('token', token);
            else
                $window.localStorage.removeItem('token');
        };
        return authTokenFactory;
    })
    .factory('Auth', function ($http, $q, AuthToken) {
        var logger = {};

    }
});