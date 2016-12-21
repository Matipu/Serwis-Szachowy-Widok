app.controller('personalizacjaCtrl', function ($scope, $http, filesService) {
	
		var kolorID = 0;
		$scope.colors = [ 
				{color1: "7777cc", color2: "77cc77"} , 
				{color1: "cccccc", color2: "333333"} , 
				{color1: "88aaff", color2: "225599"} , 
				{color1: "880000", color2: "00aaaa"} 
			];
		$scope.zmienKolorId = function(index){
			kolorID = index;
		}
		
		$scope.zmienKolor = function (){
			filesService.wczytajDane("/setUserSettings?"+
			"color1=" + $scope.colors[kolorID].color1 +
			"&color2="+ $scope.colors[kolorID].color2
			, function (response) {
                
            });
		}
	
    });
