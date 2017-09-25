
var app = angular.module('ngdemo.controllers', []);

app.controller('MyCtrl1', ['$scope', 'UserFactory', function ($scope, UserFactory) {
    UserFactory.get({}, function (userFactory) {
        $scope.firstname = userFactory.firstName;
    })
}]);