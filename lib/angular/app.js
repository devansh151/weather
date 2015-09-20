(
function () {
	var app=angular.module("weather",['ngRoute']);
	var lat=0,lon=0;
	var units=1;
	app.filter('temp',function(){

		return function (input,u){
			var output;
			var output_c=(Math.ceil(input)-273);
			var output_f=(Math.ceil((9*output_c)/5)+32);
			if (u==1) {
				output=output_c+' °C';
			}else if (u==2) {
				output=output_f+' °F';
			};
			
			return output;
		}
	});


	app.controller("search",['$http','$scope','$routeParams','$location',function($http,$scope,$routeParams,$location){
		console.log("search_ctrl");
		$scope.unit_selector='1';
		units=$scope.unit_selector;
		$scope.search=function(){
			var query=this.name;
			this.name='';
			getinfo(query);
		};
		
		var getinfo=function (query){
			$http({
			url:'http://api.openweathermap.org/data/2.5/weather',
			method:'GET',
			params:{q:query}}).then(function (response) {
				if(response.data.name){
					$scope.see(response);
					var ter='/search/'+query;
					$location.path(ter);
				}
				else{alert("no");};
			},function (response){
				alert("No such city");
			});
		};

		if ($routeParams.param) {
			getinfo($routeParams.param);
		};

		$scope.temp=function(t){
			$scope.s=t;
			if (t=="c") {
				$scope.temp=temp_c;
			}
				else if (t=="f") {
					$scope.temp=Math.ceil(((9*temp_c)/5)*32);
				};
		};

		$scope.cities=[];
		// console.log('no');

		$scope.see=function(r){
			var data=r.data;
			$scope.city=data.name;
			$scope.cities.push($scope.city);
			$scope.lat=data.coord.lat;
			$scope.lon=data.coord.lon;
			$scope.country=data.sys.country;
			$scope.desc=data.weather[0].main;
			$scope.img=data.weather[0].icon;
			$scope.date=data.dt*1000;
			$scope.wind_speed=data.wind.speed;
			$scope.wind_dir=data.wind.deg;
			$scope.pressure=data.main.pressure;
			$scope.humidity=data.main.humidity;
			$scope.sunrise=data.sys.sunrise*1000; //as date is shown epoch so to convert it multiply by 1000
			$scope.sunset=data.sys.sunset*1000;
			$scope.percentsun=($scope.date/$scope.sunset)*100;
			// var temp_c=-273;
			$scope.temp_unit=Math.ceil(data.main.temp);
			// $scope.temp_c_value=temp_c+'°C';
			// $scope.temp_f_value=Math.ceil(((9*temp_c)/5)+32)+'°F';
		};
		

	}]);

	app.controller("detailed",['$http','$scope','$routeParams',function($http,$scope,$routeParams){
		
		
		console.log("detail_ctrl");
		var get_detailed_info=function(query){
			$http({
				method:'GET',
				url:'http://api.openweathermap.org/data/2.5/forecast/daily',
				params:{q:query,cnt:8}
			}).then(function (response){
				console.log(response.data.cod);
				send_details(response);
			},function (response){
				console.log('s');
			});
		};
		if($routeParams.param){
			get_detailed_info($routeParams.param);
		}

		var send_details=function (q){
			$scope.details=q.data.list;
		};

	}]);

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

	app.service('info',['$http',function($http){

		this.detailed=function(){
			$http({
				method:'GET',
				url:'http://api.openweathermap.org/data/2.5/forecast/daily',
				params:{q:query,cnt:8}
			}).then(function (response){
				console.log(response.data.cod);
				send_details(response);
			},function (response){
				console.log('s');
			});
		};
	}]);

	// app.controller("map",function ($scope){
	// 	 console.log($scope.lat);
	// });
}
)();