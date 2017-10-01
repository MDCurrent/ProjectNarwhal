Narwhal.controller('loginController', function($scope, $http, loginService) {
	
	var userCredentials = [$scope.userName, $scope.password];
	$scope.failedLogin = false;
	
    $scope.failedLogin = loginService.login(userCredentials);
    
});