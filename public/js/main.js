//portal controllers code
//all our controllers go here.
angular.module('portalrouter', ['routerRoutes', 'authService', 'teamService', 'userService'])

    .controller('mainController', function ($rootScope, $scope, Auth) {
        $scope.error = "no errors";
        $scope.username = "";
        $scope.password = "";
        $scope.test = 1;
        $scope.loggedin = Auth.isLoggedIn();
        $scope.user = "guest, please login";
        if ($scope.loggedin) {
            $scope.logstate = "logout";

        }

        else {
            $scope.logstate = "login";
        }


        // function to handle logging out
        $scope.doLogout = function () {
            Auth.logout();
            //vm.user = '';
            $scope.user = {};

            window.location = '/portal/login';
        };

        $scope.loginuser = function () {

            Auth.login($scope.username, $scope.password)
                .then(function (data) {
                    console.log("Auth.login", data);
                    $scope.processing = false;

                    console.log("Auth detected");
                    if (data.data.success) {
                        window.location.href = "../";
                        $scope.log = "/"
                        $scope.logstate = "logout";
                    }
                    else {
                        $scope.error = data.data.message;
                    }
                });
        }
        $scope.consolecheck = function () {
            alert(1);
        }

        // check to see if a user is logged in on every request
        $rootScope.$on('$routeChangeStart', function () {
            // get user information on page load
            Auth.getUser()
                .then(function (response) {
                    $scope.user = response.data.username;
                }).catch();

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
        if (!Auth.isLoggedIn()) {
            window.location.href = "/portal/login";
        }
        Auth.getUser()
            .then(function (response) {
                if (!response) {
                    window.location.href = "portal/login";
                }
                vm.user = response.data.username;
            });
    })

    .controller('registerController', function ($scope, Auth) {
        $scope.username = '';
        $scope.password = '';
        $scope.teamname = '';
        
    })

    .controller('marketController', function (Purchase, Practice, AuthToken, $scope, Auth, CrewUpgrade, GearboxUpgrade, EngineUpgrade, TyreUpgrade, BodyUpgrade, FindTeam, FindDriver) {
        $scope.bodyPrice = 800;
        $scope.enginePrice = 640;
        $scope.gearboxPrice = 640;

        if (!Auth.isLoggedIn()) {
            window.location.href = "/portal/login";
        }
    
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
                        $scope.car = data.data.car;
                        
                        //crew
                        $scope.upgradeCrew = function () {
                            console.log(1);
                            Purchase.buy($scope.user, 300, $scope.token)
                                .then(function (response) {

                                    CrewUpgrade.buy($scope.user, $scope.token)
                                        .then(function (response) {
                                            $scope.upgradesuccess = "You have upgraded your crew efficiency by 1";
                                        });
                                });
                        }

                        //gearbox
                        $scope.upgradeGearBox = function () {

                            Purchase.buy($scope.user, $scope.gearboxPrice, $scope.token)
                                .then(function (response) {

                                    GearboxUpgrade.buy($scope.car, $scope.token)
                                        .then(function (response) {
                                            console.log("it works");
                                            $scope.upgradesuccess = "You have upgraded your gearbox by 1";
                                        });
                                });
                        }

                        //body
                        $scope.upgradeBody = function () {

                            Purchase.buy($scope.user, $scope.gearboxPrice, $scope.token)
                                .then(function (response) {

                                    BodyUpgrade.buy($scope.car, $scope.token)
                                        .then(function (response) {
                                            console.log("it works");
                                            $scope.upgradesuccess = "You have upgraded your body by 1";
                                        });
                                });
                        }

                        //engine
                        $scope.upgradeEngine = function () {

                            Purchase.buy($scope.user, $scope.gearboxPrice, $scope.token)
                                .then(function (response) {

                                    EngineUpgrade.buy($scope.car, $scope.token)
                                        .then(function (response) {
                                            console.log("it works");
                                            $scope.upgradesuccess = "You have upgraded your engine by 1";
                                        });
                                });
                        }

                        //Tyre
                        $scope.upgradeTyre = function () {

                            Purchase.buy($scope.user, 100, $scope.token)
                                .then(function (response) {

                                    TyreUpgrade.buy($scope.car, $scope.token)
                                        .then(function (response) {
                                            console.log("it works");
                                            $scope.upgradesuccess = "You have upgraded your tyre by 1";
                                        });
                                });
                        }
                    });
            });

    })
    
    .controller('raceController', function ($scope, Practice, FindTeam, Auth, AuthToken, doRace) {
        Auth.getUser()
            .then(function (response) {
                if (!response) {
                    window.location.href = "portal/login";
                }
                $scope.user = response.data.username;
            });

        if (!Auth.isLoggedIn()) {
            window.location.href = "/portal/login";
        }
        $scope.token = AuthToken.getToken();
        FindTeam.get($scope.user, $scope.token)
            .then(function (response) {
                $scope.teamdata = response.data;

                $scope.practiceRace = function () {
                    $scope.experience = Math.floor(Math.random() * 15);
                    Practice.do($scope.teamdata._id, $scope.experience, $scope.token)
                        .then(function (data) {
                            $scope.success = "You have gained " + $scope.experience + " exp";
                        })
                }
            });
        

    })
    .controller('managementController', function ($scope, AuthToken, FindTeam, FindDriver, Auth, Car) {
        Auth.getUser()
            .then(function (response) {

                $scope.user = response.data.username;

            }).catch(angular.noop());

        if (Auth.isLoggedIn() != true) {
            window.location.href = "/portal/login";
        }
        $scope.token = AuthToken.getToken()
        FindTeam.get($scope.user, $scope.token)
            .then(function (response) {
                $scope.teamdata = response.data;

                FindDriver.get($scope.teamdata.driverID, $scope.token)
                    .then(function (response) {

                        $scope.car = response.data.car;
                        $scope.driverdata = response.data;

                        Car.get($scope.car, $scope.token)
                            .then(function (response) {
                                $scope.cardata = response.data;
                            });
                    });
            });

    })
    .controller('logon', function ($scope, Auth) {
        $scope.username = "";
        $scope.password = "";

        $scope.submit = function () {
            //make an API call here i guess.
        }


    });


