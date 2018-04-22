//portal controllers code
//all our controllers go here.
angular.module('portalrouter', ['routerRoutes', 'authService', 'teamService', 'userService'])

    .controller('mainController', function ($rootScope, $scope, Auth) {
        $scope.error = "no errors";
        $scope.username = "";
        $scope.password = "";
        $scope.test = 1;
        $scope.loggedin = Auth.isLoggedIn();

        $scope.loginuser = function () {

            Auth.login($scope.username, $scope.password)
                .then(function (data) {
                    console.log("Auth.login", data);
                    $scope.processing = false;

                    console.log("Auth detected");
                    if (data.data.success) {
                        window.location.href = "../";
                    }
                    else {
                        $scope.error = data.data.message;
                    }
                });
        }
        $scope.consolecheck = function () {
            alert(1);
        }

        // function to handle logging out
        $scope.doLogout = function () {
            Auth.logout();

            //nullify the user
            $scope.user = {};

            //go to login page instead.
            $location.path('/');
        };
        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function () {
            // get user information on page load
            Auth.getUser()
                .then(function (response) {
                    if (!response) {
                        window.location.href = "portal/login";
                    }
                    $scope.user = response.data.username;
                });

        });


    })

    .controller('leaderController', function (Teams, User) {
        var vm = this;

        //Get our teams
        Teams.all()

            //handle if successful
            .then(function (res) {
                vm.teamdata = res.data;
            });
    })

    .controller('chatController', function (Auth) {
        var vm = this;
        Auth.getUser()
            .then(function (response) {
                if (!response) {
                    window.location.href = "portal/login";
                }
                vm.user = response.data.username;
            });
    })
    .controller('marketController', function (Purchase, AuthToken, $scope, Auth, CrewUpgrade, GearboxUpgrade, FindTeam, FindDriver) {
        $scope.bodyPrice = 800;
        $scope.enginePrice = 640;
        $scope.gearboxPrice = 640;
        $scope.tyrePrice = 100;
        $scope.crewPrice = 300;
    
        Auth.getUser()
            .then(function (response) {
                if (!response) {
                    window.location.href = "portal/login";
                }
                $scope.user = response.data.username;
            });

        $scope.token = AuthToken.getToken()

        FindTeam.get($scope.user, $scope.token)
            .then(function (response) {
                $scope.driverID = response.data.driverID;

                FindDriver.get($scope.driverID, $scope.token)
                    .then(function (data) {
                        console.log(data);
                        $scope.car = data.data.car;
                        

                        $scope.upgradeCrew = function () {
                            console.log(1);
                            Purchase.buy($scope.user, $scope.crewPrice, $scope.token)
                                .then(function (response) {
                                    CrewUpgrade.buy($scope.user, $scope.token)
                                        .then(function (response) {
                                        });
                                });
                        }
                        $scope.upgradeGearBox = function () {

                            Purchase.buy($scope.user, $scope.gearboxPrice, $scope.token)
                                .then(function (response) {
                                    console.log($scope.car);
                                    GearboxUpgrade.buy($scope.car, $scope.token)
                                        .then(function (response) {
                                            console.log("it works");
                                        });
                                });
                        }
                    });
            });

    })
    
    .controller('raceController', function (Races) {
        var vm = this;
        Races.all()
            .then(function (res) {
                vm.racedata = res.data;
            });
    })
    .controller('managementController', function () {
        var vm = this;
    })
    .controller('logon', function ($scope) {
        $scope.username = "";
        $scope.password = "";

        $scope.submit = function () {
            //make an API call here i guess.
        }
    });


