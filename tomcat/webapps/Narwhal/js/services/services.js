var services = angular.module('userLogin.services', ['ngResource']);

services.factory('UserFactory', function ($resource) {
    return $resource('/userLogin/rest/users', {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: false
        }
    })
});