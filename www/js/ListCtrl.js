app
.controller('ListCtrl', function($scope, $ionicLoading, $state, CompanyService, $timeout, $filter, $localStorage) {
	
	$scope.paginationItems = 30;

	// $scope.loadMore = function() {
	// 	if (( Object.keys($scope.items).length != 0) && ($scope.finishedFirstLoad)) {
	// 		var index = 0;
	// 		$ionicLoading.show({template: 'Cargando...'});
	// 		for (company in $scope.items) {
	// 			index++;
	// 			if (( index > $scope.lastItemLoaded ) && ( index <= $scope.lastItemLoaded + $scope.paginationItems )){
	// 				var comp = {};
	// 				comp = $scope.items[company];
	// 				comp.uid = company;
	// 				comp.showName = comp.name + (!!comp.following ? ' (*)' : '');
	// 				$scope.companies.push(comp);
					
	// 			}
	// 		}

	// 		$timeout(function(){
	// 			$scope.companies = $filter('orderBy')($scope.companies, 'distance');
	// 		}, 0);

	// 		$scope.lastItemLoaded  = $scope.lastItemLoaded + $scope.paginationItems;
	// 		$scope.noMoreItemsAvailable = !($scope.maxItems > $scope.lastItemLoaded);
	// 		if ( $state.params.type === 'prospects'){
	// 			$scope.companyText = 'Empresas sin web ( ' + $scope.lastItemLoaded + ' de ' + $scope.maxItems + ' )';
	// 		}else{
	// 			$scope.companyText = 'Listado ( ' + $scope.lastItemLoaded + ' de ' + $scope.maxItems + ' )';
	// 		}
	// 		$ionicLoading.hide();
	// 		$scope.$broadcast('scroll.infiniteScrollComplete');
	// 	}
		
	// };

	$scope.setFollowing = function(item){
		CompanyService.setFollowing(item.uid, !item.following, function(){
			console.log('Cambiado');
			$state.reload();
		})
	};

	var updateList = function(companyList, allList){
		var index = 0;
		$scope.items = [];
		if ( !!companyList.val() ){
			$scope.maxItems = Object.keys(companyList.val()).length;
		    companyList.forEach(function(snapshot) {
		        console.log(snapshot.key + ' - ' + snapshot.val().name + ' - ' + snapshot.val().distance);
				index++;
				if (( index <= $scope.paginationItems) || allList) {
					var comp = {};
					comp = snapshot.val();
					comp.uid = snapshot.key;
					comp.showName = comp.name + (!!comp.following ? ' (*)' : '');
					$scope.companies.push(comp);
					$scope.lastItemLoaded  = index;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
				$scope.items.push(snapshot.val());
		    });

			$timeout(function(){
				$scope.companies = $filter('orderBy')($scope.companies, 'distance');
			}, 0);

		}
		$scope.finishedFirstLoad = true;
		$ionicLoading.hide();		    
	}

	var saveData = function(companyList){

		var compTmp = [];

		companyList.forEach(function(snapshot) {
		    console.log(snapshot.key + ' - ' + snapshot.val().name + ' - ' + snapshot.val().distance);
			var comp = {};
			comp = snapshot.val();
			comp.uid = snapshot.key;
			comp.showName = comp.name + (!!comp.following ? ' (*)' : '');
			compTmp.push(comp);
			$localStorage.companies[$state.params.type].push(comp);
			$localStorage.lastItemLoaded = $localStorage.lastItemLoaded + 1;
		});

		$scope.companies = $filter('orderBy')(compTmp, 'distance');
	};

	$scope.delete = function(){
		$localStorage.companies[$state.params.type] = undefined;
		$localStorage.lastItemLoaded = undefined;
		$localStorage.dataMapLoaded  = undefined;
		$state.reload();
	};

	$scope.refresh = function(){

		$localStorage.lastItemLoaded = 0;
		$scope.lastItemLoaded = 0;

		$ionicLoading.show({template: 'Cargando...'});

		var onlyFollowing = (!!$state.params.following),
			companyRef = {};

		$localStorage.companies[$state.params.type] = [];
		$scope.companies = [];

		switch ($state.params.type){
			case ('all'):
				companyRef = firebase.database().ref('dev/kompassList').orderByChild('distance')
					.limitToFirst($scope.lastElement)
					.once('value', function(data) {

						saveData(data);
						$scope.companyText = 'Listado ( ' + $scope.lastItemLoaded + ' de ' + $scope.maxItems + ' )';

				}, function (error) {
					$ionicLoading.hide();
					$scope.companies = [];
					console.log('Error: ' + error.code);
					alert('Se produjo  un error. avísame xD');
				});			
				break;			
			case ('following'):
			case ('prospects'):
				
				if ( $state.params.type === 'prospects'){
					companyRef = firebase.database().ref('dev').child('kompassList').orderByChild('web').equalTo(null)
						.limitToFirst($scope.lastElement);
				}else{
					companyRef = firebase.database().ref('dev').child('kompassList').orderByChild('following').equalTo(true)
						.limitToFirst($scope.lastElement);
				}
				companyRef.once('value', function(data) {
					if ( $state.params.type === 'prospects'){
						$scope.companyText = 'Empresas sin web ( ' + $scope.lastItemLoaded + ' de ' + $scope.maxItems + ' )';
					}else{
						$scope.companyText = 'En seguimiento ( ' + $scope.maxItems + ' )';
					}
					saveData(data);
					$ionicLoading.hide();
				}, function (error) {
					$ionicLoading.hide();
					$scope.companies = [];
				   console.log('Error: ' + error.code);
				   alert('Se produjo  un error. avísame xD');
				});
				break;
		}
	};

    $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
    	if ( !$localStorage.companies) $localStorage.companies = {};
    	if ( !$localStorage.lastItemLoaded) $localStorage.lastItemLoaded = {};

		$scope.companies = $localStorage.companies[$state.params.type] || [];
		$scope.lastItemLoaded  = $localStorage.lastItemLoaded[$state.params.type] || 0;
		$scope.firstElem = $scope.lastItemLoaded;
		$scope.lastElement = $scope.lastItemLoaded + $scope.paginationItems;
    });
    
    /*$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		$localStorage.lastItemLoaded = $scope.lastItemLoaded;
		$localStorage.maxItems = $scope.maxItems;
    });*/


});