var login = angular.module("login", ["userService", "authService"]);

login.controller('login', function (User) {
    var vm = this;
    vm.username = "";
    vm.password = "";

    $scope.submit = function () {
        //authenticate the user
    }
});
