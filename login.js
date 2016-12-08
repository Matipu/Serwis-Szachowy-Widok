app.controller('loginCtrl', function ($scope, $cookies, $http) {

		$scope.zalogujSie = function() {
			var params = { address: "Zlin, Czech Republic", sensor: false };

			
			$http.get("http://localhost:58949/Chess/login?email=asd@o2.pl&password=xD", {
				params: params,
				data:"dupa",
			}).success(function(response) {
					console.log(response.sessionId);
					$cookies.put('sessionId', response.sessionId);
					$cookies.put('user', response.user);
	
			});
		};
		
		
    });
