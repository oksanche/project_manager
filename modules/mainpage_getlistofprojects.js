// Автор: Панфилова Оксана
var app = angular.module('listofprojects',[]);
app.controller('listofprojectsController', function($scope, $http) {
		$http.get("./mainpage/listofprojects").then(function (response) {$scope.projects = response.data.rows; 
		});
});