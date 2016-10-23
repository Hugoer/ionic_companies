var companyCtrlFn = ['$scope', '$state', '$ionicLoading', 'MapService', '$timeout', 'CompanyService',
function($scope, $state, $ionicLoading, MapService, $timeout, CompanyService) {

	$scope.openInExternalBrowser = function(url){
	  // Open in external browser
	  window.open(url,'_system','location=yes'); 
	};

	$scope.openGeo = function(){
		var _this = this;
		// 	_url = 'geo://0,0?q=' + _this.company.streetAddressFormated;

		// window.open(_url,'_system','location=yes');
		MapService.openGeo(_this.company.streetAddressFormated);
	};

	$scope.openInAppBrowser = function(url){
	  // Open in app browser
	  window.open(url,'_blank'); 
	};

	$scope.follow = function(){
		var newValue = !$scope.company.following;
		CompanyService.setFollowing($scope.company.uid, newValue, function(){
			$timeout(function(){
				$scope.company.following = newValue;
				if( $scope.company.following === true ) {
					$scope.followText = 'Dejar de seguir';	
				}else{
					$scope.followText = 'Seguir';
				}
			},0);
		});
	};

	var formatGoogleText = function(text){
		text = text.replace(/\s/g, "+");
		// while (text.indexOf('++') > 0){
		// 	text = text.replace('++','+');
		// }
		if (text.indexOf('++') > 0){
			text = text.substring(0, text.indexOf('++') );
		}
		return text;
	};

	$scope.hideNote = function(companyUid, note){
		CompanyService.hideNote(companyUid, note,function(){
			CompanyService.showNotes($scope.company.uid,function(response){
				$timeout(function(){
	                $scope.noteList = response;
	            },0);				
			});			
		});
	};

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

		$scope.company = {};
		$ionicLoading.show({template: 'Cargando...'});
		$scope.company = angular.fromJson($state.params.info);
		$scope.company.streetAddressFormated = formatGoogleText($scope.company.streetAddress) + '+' + $scope.company.city;
		if( $scope.company.following === true ) {
			$scope.followText = 'Dejar de seguir';	
		}else{
			$scope.followText = 'Seguir';
			$scope.company.following = false;
		}

        CompanyService.showNotes($scope.company.uid,function(response){
            $timeout(function(){
                $scope.noteList = response;
            },0);
        });

		$ionicLoading.hide();
	});

	$scope.$on( "$ionicView.enter", function( scopes, states ) {	
		if (!!$scope.company.position){
			initialize($scope.company.position.latitud, $scope.company.position.longitud, $scope.company.name);
		}		
	});

	function initialize(lat,lng, name) {
		var position = {
			'lat' : lat,
			'lng' : lng
		};
		$scope.map = MapService.createMap(position, 'map');
		$timeout(function(){
			MapService.createMarker(position, $scope.map, name, $scope );
		},0);
	}
}];
app.controller('CompanyCtrl', companyCtrlFn);