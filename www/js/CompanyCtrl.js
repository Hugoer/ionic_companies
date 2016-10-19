app
.controller('CompanyCtrl', function($scope, $state, $ionicLoading, MapService, $timeout, CompanyService) {

	$scope.companyUid = $state.params.uid;

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
		CompanyService.setFollowing($state.params.uid,newValue, function(){
			$scope.company.following = newValue;
			if( $scope.company.following === true ) {
				$scope.followText = 'Dejar de seguir';	
			}else{
				$scope.followText = 'Seguir';
			}
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
			CompanyService.showNotes($scope.company,function(response){
				$timeout(function(){
	                $scope.noteList = response;
	            },0);				
			});			
		});
	};

	$scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {

		$scope.company = {};
		$ionicLoading.show({template: 'Cargando...'});

		var companyRef = firebase.database().ref('dev/kompassList/' + $state.params.uid);
		companyRef.once('value', function(data) {
						
			$scope.company = data.val();
			if ( !!$scope.company ){
				$scope.company.uid = $scope.companyUid;
				$scope.company.streetAddressFormated = formatGoogleText($scope.company.streetAddress) + '+' + $scope.company.city;
				if( $scope.company.following === true ) {
					$scope.followText = 'Dejar de seguir';	
				}else{
					$scope.followText = 'Seguir';
					$scope.company.following = false;
				}
				
				CompanyService.showNotes($scope.company,function(response){
					$timeout(function(){
		                $scope.noteList = response;
		            },0);				
				});
			}

			$ionicLoading.hide();

		}, function (error) {
			$ionicLoading.hide();
			$scope.companies = [];
		   console.log('Error: ' + error.code);
		});

	});

	$scope.$on( "$ionicView.enter", function( scopes, states ) {	
		if (!!$scope.company.position){
			initialize($scope.company.position.latitud, $scope.company.position.longitud, $scope.company.name);
		}
	});

	function initialize(lat,lng, name) {
		// var myLatlng = new google.maps.LatLng(lat,lng);
		// var mapOptions = {
		// 	center: myLatlng,
		// 	zoom: 16,
		// 	mapTypeId: google.maps.MapTypeId.ROADMAP
		// };
		// var map = new google.maps.Map(document.getElementById("map"),
		// mapOptions);

		// //Marker + infowindow + angularjs compiled ng-click
		// // var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
		// // var compiled = $compile(contentString)($scope);

		// // var infowindow = new google.maps.InfoWindow({
		// // 	content: compiled[0]
		// // });

		// var marker = new google.maps.Marker({
		// 	position: myLatlng,
		// 	map: map,
		// 	title: 'Uluru (Ayers Rock)'
		// });

		// // google.maps.event.addListener(marker, 'click', function() {
		// // 	infowindow.open(map,marker);
		// // });

		// $scope.map = map;
		var position = {
			'lat' : lat,
			'lng' : lng
		};
		$scope.map = MapService.createMap(position, 'map');
		$timeout(function(){
			MapService.createMarker(position, $scope.map, name, $scope );
		},0);
		

	}
	// google.maps.event.addDomListener(window, 'load', initialize);
});