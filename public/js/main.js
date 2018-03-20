//ANGULAR CODE
//quick test for angular i coded up. I'll leave it here incase i need to add things.
var app1 = angular.module("app1", []);

app1.controller('test', function($scope) {
    $scope.first = 1;
    $scope.second = 1;

    $scope.update = function() {
        $scope.calculation = $scope.first + "+" + $scope.second + " = " + (+$scope.first + +$scope.second) + " QUIK MATHS";
    }
});
