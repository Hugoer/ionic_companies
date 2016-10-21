app
.controller('ListCtrl', function($scope, $ionicLoading, $state, CompanyService, $timeout, $filter, $localStorage) {
	
	$scope.paginationItems = 30;

	$scope.search = function(){

		if ( !!$scope.companySearch ){
			
			$scope.isSearchResult = true;

			$ionicLoading.show({template: 'Cargando...'});
			$localStorage.companies.search = [];

			companyRef = firebase.database().ref('dev/kompassList')
				.once('value', function(data) {
					
					var searchText = $scope.companySearch.toLowerCase(),
						result = [];

					data.forEach(function(snapshot) {
						if( snapshot.val().name.toLowerCase().indexOf(searchText) >= 0 ){
							var comp = {};
							comp = snapshot.val();
							comp.uid = snapshot.key;
							comp.showName = comp.name + (!!comp.following ? ' (*)' : '');
							result.push(comp);
							// $localStorage.companies['search'].push(comp);
						}
					});	

					$timeout(function(){
						$scope.companies = $filter('orderBy')(result, 'distance');
					},0);

					$ionicLoading.hide();

			}, function (error) {
				$ionicLoading.hide();
				console.log('Error: ' + error.code);
				alert(JSON.stringify(error));
			});	
		}

	};

	$scope.loadMore = function(){
		console.log('loadmore!!!');
		$scope.lastElement = $scope.lastElement + $scope.paginationItems;
		$scope.refresh();
	};

	$scope.setFollowing = function(item){
		CompanyService.setFollowing(item.uid, !item.following, function(){
			console.log('Cambiado');
			$state.reload();
		});
	};

	$scope.changeState = function(company){

		var params = {
			'info' : angular.toJson(company)
		};
		$state.go('app.company', params);

	};

	var saveData = function(companyList){

		var compTmp = [];

		companyList.forEach(function(snapshot) {
		    // console.log(snapshot.key + ' - ' + snapshot.val().name + ' - ' + snapshot.val().distance);
			var comp = {};
			comp = snapshot.val();
			comp.uid = snapshot.key;
			comp.showName = comp.name + (!!comp.following ? ' (*)' : '');
			compTmp.push(comp);
			$localStorage.companies[$state.params.type].push(comp);
			$localStorage.lastItemLoaded = $localStorage.lastItemLoaded + 1;
		});

		$timeout(function(){
			$scope.companies = $filter('orderBy')(compTmp, 'distance');
			$scope.firstLoadDone = true;
			_updateTitle();
		},0);
		
	};

	$scope.delete = function(){
		$scope.companies = [];
		$localStorage.companies[$state.params.type] = undefined;
		$localStorage.lastItemLoaded = undefined;
	};

	var _updateTitle = function(){
		var title = '';
		switch($state.params.type){
			case ('all'):
				$scope.companyText = 'Todas ( ' + $scope.lastElement + ' )';
				break;
			case ('following'):
				$scope.companyText = 'Siguiendo ( ' + $scope.lastElement + ' )';
				break;
			case ('prospects'):
				$scope.companyText = 'Sin web ( ' + $scope.lastElement + ' )';
				break;
		}
	}

	$scope.refresh = function(){

		$localStorage.lastItemLoaded = 0;
		$scope.lastItemLoaded = 0;
		
		$scope.isSearchResult = false;
		$scope.companySearch = '';

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
						
						$ionicLoading.hide();
				}, function (error) {
					$ionicLoading.hide();
					$scope.companies = [];
					console.log('Error: ' + error.code);
					alert(JSON.stringify(error));
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
					saveData(data);
					$ionicLoading.hide();
				}, function (error) {
					$ionicLoading.hide();
					$scope.companies = [];
				   console.log('Error: ' + error.code);
				   alert(JSON.stringify(error));
				});
				break;
		}
	};

    $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
    	if ( !$localStorage.companies) $localStorage.companies = {};
    	if ( !$localStorage.lastItemLoaded) $localStorage.lastItemLoaded = {};

    	if ( !$scope.companies || $scope.companies.length === 0){
    		$scope.companies = $filter('orderBy')($localStorage.companies[$state.params.type], 'distance') || [];
			$scope.lastItemLoaded  = $localStorage.lastItemLoaded[$state.params.type] || 0;
			$scope.firstElem = $scope.lastItemLoaded;
			$scope.lastElement = $scope.lastItemLoaded + $scope.paginationItems;    		
    	}

    });
    
    /*$scope.$on( "$ionicView.beforeLeave", function( scopes, states ) {
		$localStorage.lastItemLoaded = $scope.lastItemLoaded;
		$localStorage.maxItems = $scope.maxItems;
    });*/


});