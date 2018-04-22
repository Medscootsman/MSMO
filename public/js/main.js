//portal controllers code
//all our controllers go here.
angular.module('portalrouter', ['routerRoutes', 'teamService', 'userService'])

    .controller('mainController', function () {
        var vm = this;
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

    .controller('chatController', function (Races) {
                var vm = this;
    })
    .controller('marketController', function () {
        var vm = this;
    })
    .controller('raceController', function () {
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


