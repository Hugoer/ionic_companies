var mapCtrlFn = ['$scope', '$ionicLoading', '$state', 'MapService', '$timeout', '$localStorage',
function($scope, $ionicLoading, $state, MapService, $timeout, $localStorage) {

	$scope.position = {
		'lat' : 42.2380134,
		'lng' : -8.7254468
	};
	$scope.filters = {};
	$scope.filters.range = 500;
	$scope.filters.following = true;
	$scope.filters.prospects = true;

	$scope.circleVisible = true;
	$scope.markerVisible = false;

	$scope.fixedMap = true;
	$scope.isGroupShown = true;

	$scope.markerList = [];

	var initialize = function(position, name){
		$scope.map = MapService.createMap(position, 'fullmap');
		$timeout(function(){
			MapService.createMarker(position, $scope.map, name, $scope );
			// $scope.circle = MapService.createCircle(position, $scope.map, parseInt($scope.filters.range));
		},0);		
	};

	$scope.refreshData  = function(){
		$ionicLoading.show({template: 'Cargando...'});

		var companyRef = firebase.database().ref('dev').child('kompassList').orderByChild('following').equalTo($scope.filters.following);
		companyRef.on('value', function(data) {
			var list = [];
			
			for (var company in data.val()) {
				//Si sólo queremos los que tengan web, o no ( dependiendo del check
				if ( !!$scope.filters.prospects === !data.val()[company].web ){
					if ( data.val()[company].distance <= $scope.filters.range ){
						list.push({
							'key' : company,
							'value' : data.val()[company]
						});
					}
				}
			}

			$scope.markerList = list;
			$scope.markersCount = list.length;
			$ionicLoading.hide();
		}, function(err){
			$scope.markerList = [];
			$ionicLoading.hide();
		});
	};

	$scope.clickTest = function(item){
		console.log(item);
		alert('0sdfdfsdf');
	};
	
	$scope.openGeo = function(){
		MapService.openGeo('Vigo');
	};

	$scope.showCircle = function(){
		if ( !!$scope.circleVisible ){
			$scope.circle.setMap(null);
		}else{
			$scope.circle.setMap($scope.map);
		}
		$scope.circleVisible = !$scope.circleVisible;
	};

	$scope.showMarkers = function(){
		if ( !!$scope.markerVisible ){
			if ( !!$scope.markerArray && $scope.markerArray.length > 0 ){
				MapService.clearMarkers($scope.markerArray);
			}
		}else{
			$scope.markerArray = MapService.createArrayMarker($scope.markerList, $scope.map, $scope);
		}
		$scope.markerVisible = !$scope.markerVisible;
	};

	$scope.doScroll = function(newValue){
		$scope.fixedMap = !newValue;
		MapService.setScrollMap($scope.map, newValue);
	};

	$scope.tooggleShown = function(){
		$scope.isGroupShown = !$scope.isGroupShown;
	};

	$scope.changeFilters = function( modifyCircle ){
		
		$scope.refreshData();

		if ( !!modifyCircle ){
			
			MapService.clearMarkers($scope.markerArray);

			if ( !!$scope.circle ){
				$scope.circle.setMap(null);
			}

			if ( !!$scope.circleVisible ){
				$scope.circle = MapService.createCircle($scope.position, $scope.map, parseInt($scope.filters.range) );	
			}

		}

	};

    $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
		// $scope.refreshData();
    });

	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		initialize($scope.position, 'Casa');
		$scope.changeFilters(true);
	});

}];


app.controller('MapCtrl', mapCtrlFn);