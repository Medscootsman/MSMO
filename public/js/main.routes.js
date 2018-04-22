angular.module('routerRoutes', ['ngRoute'])

    //configure our routes 
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {

                //base page
                templateUrl: 'views/pages/home.html',
                controller: 'mainController',
                controllerAs: 'main'
            })

            .when('/portal/login', {

                //base page
                templateUrl: 'views/pages/login.html',
                controller: 'mainController',
                controllerAs: 'main'
            })

            //leaderboard page
            .when('/portal/leaderboard', {
                templateUrl: 'views/pages/leaderboard.html',
                controller: 'leaderController',
                controllerAs: 'leader'
            })

            .when('/portal/chat', {
                templateUrl: 'views/pages/chat.html',
                controller: 'chatController',
                controllerAs: 'chat'
            })

            .when('/portal/marketplace', {
                templateUrl: 'views/pages/marketplace.html',
                controller: 'marketController',
                controllerAs: 'market'
            })

            .when('/portal/races', {
                templateUrl: 'views/pages/race.html',
                controller: 'raceController',
                controllerAs: 'race'
            })

            .when('/portal/management', {
                templateUrl: 'views/pages/management.html',
                controller: 'managementController',
                controllerAs: 'manage'
            });
            
            
        // set our app up to have pretty URLS
        $locationProvider.html5Mode(true);
    });