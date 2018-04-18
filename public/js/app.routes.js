angular.module('routerRoutes', ['ngRoute'])

    //configure our routes 
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/pages/main.html',
                controller: 'mainController',
                controllerAs: 'main'
            })

            .when('/leaderboard', {
                templateUrl: 'views/pages/leaderboard.html',
                controller: 'mainController',
                controllerAs: 'leader'
            });
        // set our app up to have pretty URLS
        $locationProvider.html5Mode(true);
    });