angular.module('authService', [])
    .factory('AuthToken', function ($window) {
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
        return auth;
    })
    .factory('Auth', function ($http, $q, AuthToken) {
        // create auth factory object
        var authFactory = {};
        // log a user in
        authFactory.login = function (givenusername, givenpassword) {

            // return the promise object and its data
            return $http.post('/api/auth', {
                username: givenusername,
                password: givenpassword
            })
                .then(function (data) {
                    AuthToken.setToken(data.data.token);
                    return data;
                });
        };
        // log a user out by clearing the token
        authFactory.logout = function () {
            // clear the token
            AuthToken.setToken();
        };
        // check if a user is logged in
        // checks if there is a local token 
        authFactory.isLoggedIn = function () {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };

        // get the logged in user
        authFactory.getUser = function () {
            if (AuthToken.getToken())
                return $http.get('/api/token/' + AuthToken.getToken(), {
                    cache: true
                });
            else
                return $q.reject({ message: 'User has no token.' });
        };
        // return auth factory object
        return authFactory;

    })

    .factory('AuthRegisterUser', function ($http, $q, Auth) {
        var factory = {};

			factory.RegisterUser = function (givenpersonName, givenusername, givenpassword) {
				//register a user, a team, and 1 driver.
				return $http.post('/api/users/', {
					personName: givenpersonName,
					username: givenusername,
					password: givenpassword,
				});
			}
            factory.registerTeam = function (givenusername, teamname, driverid) {
                return $http.post('api/teams', {
                    name: teamname,
                    dID: driverid,
                    username: givenusername,
                });
            }

            factory.registerDriver = function (carname, fname, sname) {
                return $http.post('/api/drivers', {
                    name: carname,
                    forename: fname,
                    surname: sname,
                });
            }
            return factory;
        })
    
    // ===================================================
    // application configuration to integrate token into requests
    // ===================================================
    .factory('AuthInterceptor', function ($q, $location, AuthToken) {
        var interceptorFactory = {};
        // this will happen on all HTTP requests 
        interceptorFactory.request = function (config) {
            // grab the token 
            var token = AuthToken.getToken();
            // if the token exists, add it to the header as x-access-token
            if (token)
                config.headers['x-access-token'] = token;
            return config;
        };
        // happens on response errors
        interceptorFactory.responseError = function (response) {
            // if our server returns a 403 forbidden response
            if (response.status == 403) {
                AuthToken.setToken();
                $location.path('/login');
            }
            // return the errors from the server as a promise
            return $q.reject(response);
        };
        return interceptorFactory;
    }); 
