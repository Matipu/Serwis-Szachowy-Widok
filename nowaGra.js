app.controller('nowaGraCtrl', function ($scope, $http, $httpParamSerializerJQLike, $location, filesService, notificationsService) {
	    $scope.czyWyborPrzeciwnika = true;

		
		$scope.wybierzPrzeciwnika = function($czyKomputer) {
			$scope.czyWyborPrzeciwnika = false;
			$scope.czyWybranoKomputer = $czyKomputer;
		};
		
		$scope.dodaj = function(){

				filesService.zapiszFormularz("/AddNewGameWitchComputer", function(response) {}, 
				{color: $scope.color, difficult: $scope.difficult});
				
				notificationsService.setSuccess("Dodano pomyslnie nowa gre!");
				$location.path("/AktualneGry");
		}
		
    });