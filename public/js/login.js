var login = angular.module("app1", []);

login.controller('login', function ($scope) {
    $scope.username = "";
    $scope.password = "";

    $scope.submit = function () {
        //make an API call here i guess.
    }
});
