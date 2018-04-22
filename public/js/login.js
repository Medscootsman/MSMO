var login = angular.module("LoginController", ["authService"]);

login.controller('login', function ($rootScope, $location, Auth, $scope) {
    $scope.error = "no errors";
    $scope.username = "";
    $scope.password = "";
    $scope.test = 1;
    $scope.loggedin = Auth.isLoggedIn;

    $scope.loginuser = function() {
        console.log(1);

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
    $scope.consolecheck = function() {
        alert(1);
    }

    // function to handle logging out
    $scope.doLogout = function() {
        Auth.logout();

        //nullify the user
        $scope.user = {};

        //go to login page instead.
        $location.path('/');
    };
});
