/*
 Weather Pro App
 Created By- Siddharth Dubey
 Version -> AngularJS v1.4.4
*/
(
	function (){
		var app=angular.module("weather",['ngRoute']);

		//***Custom filters for the application***///

			//Custom filter for temperature to toggle between celcius & farenheit
			app.filter('temp',function(){

			return function (input,u){
				var output;
				var output_c=(Math.ceil(input)-273);
				var output_f=(Math.ceil((9*output_c)/5)+32);

				// 1 for celcius and  2 for farenheit
				if (u==1) {
					output=output_c+' °C';
				}else if (u==2) {
					output=output_f+' °F';
				};
				
				return output;
			}
			});

		//**Additional services to be shared amongst controllers***///

			//Service to get data from the OpenWeathe API
			app.service('info',['$http',function($http){
				
				var details=function (query,type) {
								
								// using @param:type to indicate the type of data required
									// 10 for forecasts and 5 for current day data.

								if (type===10) {
									return $http({
										method:'GET',
										url:'http://api.openweathermap.org/data/2.5/forecast/daily',
										params:{q:query,cnt:8} //cnt sets number of days for which the forecast is required (Max:16)
										});
								} else if (type===5){
									return $http({
										url:'http://api.openweathermap.org/data/2.5/weather',
										method:'GET',
										params:{q:query}});
								};
							};

				return {
					details:details
				}
				
			}]);

		//***Controllers for the application***///

			//...Main controller for the application

			app.controller("search",['$scope','$location','$routeParams','info',function ($scope,$location,$routeParams,info){

				$scope.unit_selector='1';
				var dataSetter=function (daily,forecast,type) {
					$scope.forecast=forecast.data;
					$scope.daily=daily.data;
				}

				var dataGetter=function (d,n) {
					var daily_data=info.details(d,5);
					var detailed_forecast=info.details(d,10);
					detailed_forecast.then(function (rF){
						daily_data.then(function (rD){
							dataSetter(rD,rF,n);
						},function (e){
								console.log("Daily data error");
						});	
					},function (e){
						console.log("Daily forecast error");
					});
				};

				if ($routeParams.param) {
					dataGetter($routeParams.param,444);
				};

				$scope.search=function(){
					var query=this.name;
					console.log('s');
					this.name='';
					dataGetter(query,888);
					var ter='/search/'+query;
					$location.path(ter);	
				};

				
			}]);

			//..Controller for activating required tab
			app.controller("tabs",['$scope',function($scope){
				console.log("tabs_ctrl");
				$scope.tab=1;
				$scope.isSet=function(q){
					return $scope.tab===q;
				}
				$scope.setTab=function(q){
					$scope.tab=q;
				}
			}]); 
	}
)();