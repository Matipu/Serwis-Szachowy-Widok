﻿app.controller('szachownicaCtrl', function ($scope, $http, $location, filesService, $timeout) {
        $scope.pobierzPole = function (wiersz, kolumna, id) {
            return $scope.gry[id].figures[wiersz][kolumna];
        };
		

		var liczbaRuchow = 0;
				
        $scope.kolorPola = function (wiersz, kolumna) {
            for (i = 0; i < $scope.mozliweRuchy.length; i++) {
                if ($scope.mozliweRuchy[i].line == wiersz && $scope.mozliweRuchy[i].collumn == kolumna) {
                    return { 'background-color': '#11791966', 'box-shadow': '0px 0px 0px 1px black inset' };

                }
            }
            if ($scope.aktywnePole != null && $scope.aktywnePole.wiersz == wiersz && $scope.aktywnePole.kolumna == kolumna) {
                return { 'background-color': '#711919' };
            }
            else {
                if ((wiersz % 2 == 0 && kolumna % 2 == 0) || (wiersz % 2 == 1 && kolumna % 2 == 1)) {
                    return { 'background-color': $scope.kolorPolaBialego };
                } else {
                    return { 'background-color': $scope.kolorPolaCzarnego };
                }
            }
        };

        $scope.aktywujPole = function (wiersz, kolumna) {
			
			for (i = 0; i < $scope.mozliweRuchy.length; i++) {
                if ($scope.mozliweRuchy[i].line == wiersz && $scope.mozliweRuchy[i].collumn == kolumna) {
	
					filesService.wczytajDane("/makeAMove/?&gameId="+$scope.id.toString()+
					"&iLine="+$scope.aktywnePole.wiersz.toString()+
					"&iCollumn="+$scope.aktywnePole.kolumna.toString()+
					"&tLine="+wiersz+
					"&tCollumn="+kolumna,
					function (response) {
							$scope.gry[0].figures[wiersz][kolumna] = $scope.gry[0].figures[$scope.aktywnePole.wiersz][$scope.aktywnePole.kolumna];
							$scope.gry[0].figures[$scope.aktywnePole.wiersz][$scope.aktywnePole.kolumna] = null;
							$scope.aktywnePole.wiersz = -1;
							$scope.aktywnePole.kolumna = -1;
							$scope.mozliweRuchy = {};
							wczytajPrzewage();
							liczbaRuchow = $scope.liczbaRuchow;
							$timeout(czekajNaRuchPrzeciwnika, 1000);
					});
					return;
                }
            }
			$scope.mozliweRuchy = {};
            if ($scope.gry[0].figures[wiersz][kolumna] != "") {
                $scope.aktywnePole.wiersz = wiersz;
                $scope.aktywnePole.kolumna = kolumna;
                wczytajPlikZMozliwymiRuchami(wiersz, kolumna);

            } else {
                $scope.aktywnePole.wiersz = -1;
                $scope.aktywnePole.kolumna = -1;
            }
        };

        function wczytajPlikZMozliwymiRuchami(wiersz, kolumna) {
            filesService.wczytajDane("/PossibleMoves/?gameId="+$scope.id.toString()+
			"&line="+wiersz.toString()+
			"&collumn="+kolumna.toString()
			, function (response) {
                $scope.mozliweRuchy = response.data;

            });

        };
		

		function czekajNaRuchPrzeciwnika() {
			if(liczbaRuchow+2 != $scope.liczbaRuchow){
				wczytajSzachownice();
				$timeout(czekajNaRuchPrzeciwnika, 1000);
			}
		};

		
		function wczytajPrzewage() {
            filesService.wczytajDane("/advantage/?gameId="+$scope.id.toString()
			, function (response) {

                $scope.przewagaBialych = response.data.advantage.toFixed(2);
				$scope.przewagaCzarnych = (1-($scope.przewagaBialych)).toFixed(2);
				
				$scope.przewagaBialychPx = $scope.przewagaBialych*400;
				$scope.przewagaCzarnychPx = $scope.przewagaCzarnych*400;
            });

        };

	
		function wczytajSzachownice() {
			$scope.error = filesService.wczytajDane("?&gameId="+$scope.id.toString(), function(response) {
				
				$scope.gry = [];
				$scope.gry[0] = response.data;
				$scope.gry[0].kolejnoscWierszy = [];
				if ($scope.gry[0].playerColor == "b")
					$scope.gry[0].kolejnoscWierszy = [0, 1, 2, 3, 4, 5, 6, 7];
				if ($scope.gry[0].playerColor == "w")
					$scope.gry[0].kolejnoscWierszy = [7, 6, 5, 4, 3, 2, 1, 0];
                 $scope.aktywnePole = Object;
				 $scope.statusKoncowy = $scope.gry[0].finishStatus;
                 $scope.aktywnePole.wiersz = -1;
                 $scope.aktywnePole.kolumna = -1;
				 $scope.historia = response.data.history.reverse();
				 $scope.liczbaRuchow = response.data.numberOfMovements;

		})};

        function wczytajUstawienia() {
			filesService.wczytajDane("/getUserSettings"
			, function (response) {
				$scope.kolorPolaBialego = "#"+response.data.background_color;
				$scope.kolorPolaCzarnego = "#"+response.data.background_color2;
			});

        };
		
		$scope.getHistory = function(index) {
			return (index+1).toString() + '.   ' + String.fromCharCode(97 + $scope.historia[index].init.collumn) + (8-$scope.historia[index].init.line).toString()
			+' -> '+ String.fromCharCode(97 + $scope.historia[index].target.collumn) + (8-$scope.historia[index].target.line).toString();

        };

		$scope.indexChar = function (index) {
			return String.fromCharCode(65 + index);
		};

		$scope.cofnjiRuch = function () {
            filesService.wczytajDane("/backMove?gameId="+$scope.id.toString()
				, function (response) {
					wczytajSzachownice();
            });
        };
		$scope.poddajSie = function () {
            filesService.wczytajDane("/surrender?gameId="+$scope.id.toString()
				, function (response) {
					wczytajSzachownice();
            });
        };
		
		$scope.id = $location.search().id;
		$scope.przewagaBialych = 0.5;
		$scope.przewagaCzarnych = 0.5;
        $scope.mozliweRuchy = [];
        wczytajPrzewage();
        wczytajSzachownice();
		wczytajUstawienia();
    });