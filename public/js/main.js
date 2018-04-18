//app1 controller code
angular.module('portalrouter', ['routerRoutes'])

    .controller('mainController', function () {
        var vm = this;
    })

    .controller('leaderController', function () {
        var vm = this;
    })

    .controller('chatController', function () {
        var vm = this;
    })
    .controller('marketController', function () {
        var vm = this;
    })
    .controller('raceController', function () {
        var vm = this;
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


