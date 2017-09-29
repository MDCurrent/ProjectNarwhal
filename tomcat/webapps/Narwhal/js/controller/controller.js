
var app = angular.module('userLogin.controllers', []);

app.controller('MyCtrl1', ['$scope', 'UserFactory', function ($scope, UserFactory) {
    UserFactory.get({}, function (userFactory) {
        $scope.firstname = userFactory.firstName;
    })
}]);