var app = angular.module('Login', [
	'ngRoute',
	'loginService', 
	'loginController'
]);

config(['$routeProvider'], function($routeProvider){
	$routeProvider.when("/login", {templateUrl: "views/login.html", controller:"loginController"}).
	otherwise({redirectTo: "/login"});
})