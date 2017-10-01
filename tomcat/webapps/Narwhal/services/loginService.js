angular.service('loginService', function($resource, $window){
	var self = this;
	
	self.login = function(user){
		$resource('Controllers/userController/users/login', {}, {
			loginCheck:{
				method: 'GET',
				params: {credentials:user},
			}
		})
		if(loginCheck == false){
			return false;
		}
		else{
			$window.location.herf = '/index.html';
		}
	}
});