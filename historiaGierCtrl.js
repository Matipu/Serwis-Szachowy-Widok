app.controller('historiaGierCtrl', function ($scope, $cookies, $http, filesService) {
		
		$scope.pobierzPole = function (wiersz, kolumna, id) {
            return $scope.gry[id].figures[wiersz - 1][kolumna - 1];
        };

        $scope.kolorPola = function (wiersz, kolumna) {


                if ((wiersz % 2 == 0 && kolumna % 2 == 0) || (wiersz % 2 == 1 && kolumna % 2 == 1)) {
                    return { 'background-color': $scope.kolorPolaBialego };
                } else {
                    return { 'background-color': $scope.kolorPolaCzarnego };
                }
        };

        function wczytajUstawienia() {
            $http.get("ustawieniaGry.json").then(function (response) {
                var ustawienia = response.data;
                $scope.kolor = ustawienia.mojKolor;
                $scope.kolorPolaBialego = ustawienia.kolorPolaBialego;
                $scope.kolorPolaCzarnego = ustawienia.kolorPolaCzarnego;
            });
        };


        wczytajUstawienia();
		
		function wczytajAktualneGry() {
			filesService.wczytajDane("/history", function(response) {
               $scope.gry = response.data;
				for (i = 0; i < $scope.gry.length; i++) {
					$scope.gry[i].kolejnoscWierszy = [];
					$scope.gry[i].zwiniete = true;
					if ($scope.gry[i].playerColor == "b")
						$scope.gry[i].kolejnoscWierszy = [1, 2, 3, 4, 5, 6, 7, 8];
					if ($scope.gry[i].playerColor == "w")
						$scope.gry[i].kolejnoscWierszy = [8, 7, 6, 5, 4, 3, 2, 1];
				}

		})};

		wczytajAktualneGry();
		
		
    });