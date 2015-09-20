angular.module("weather").config(function ($routeProvider){
	$routeProvider.when('/search/:param',{
		templateUrl:'lib/templates/result.html',
		reloadOnSearch:false,
		controller:'search'
	}).when('/',{
		templateUrl:'lib/templates/main.html'
	}).when('/search',{
		templateUrl:'lib/templates/result.html',
		controller:'search'
	}).otherwise({
		redirectTo:'/'
	});
});