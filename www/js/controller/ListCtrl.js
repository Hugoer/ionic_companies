var listCtrlFn = ['$scope', '$ionicLoading', '$state', 'CompanyService', '$timeout', '$filter', '$localStorage',
function($scope, $ionicLoading, $state, CompanyService, $timeout, $filter, $localStorage) {
	
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
		// var compTmp = [];
		var minValue = ($scope.lastElement - $scope.paginationItems),
			maxValue = $scope.lastElement;
		
		console.log(minValue,maxValue);

		var tmp = [];

		companyList.forEach(function(item){
			var tmpValue = {};

			switch ($state.params.type){
				case 'all':
					tmpValue = item.val();
					tmpValue.uid = item.key;
					tmpValue.showName = tmpValue.name + (!!tmpValue.following ? ' (*)' : '');
					tmp.push(tmpValue);
					break;
				case 'prospects':
					if (!item.val().web){
						tmpValue = item.val();
						tmpValue.uid = item.key;
						tmpValue.showName = tmpValue.name + (!!tmpValue.following ? ' (*)' : '');
						tmp.push(tmpValue);					
					}				
					break;
				case 'following':
					if (!!item.val().following){
						tmpValue = item.val();
						tmpValue.uid = item.key;
						tmpValue.showName = tmpValue.name + (!!tmpValue.following ? ' (*)' : '');
						tmp.push(tmpValue);					
					}
					break;
			}

		});

		tmp = $filter('orderBy')(tmp, 'distance');
		tmp = $filter('limitTo')(tmp, maxValue, minValue);
		$localStorage.companies[$state.params.type] = tmp;
		$localStorage.lastItemLoaded[$state.params.type] = maxValue;
		$scope.lastItemLoaded = maxValue;
		$timeout(function(){
			// $scope.companies = $filter('orderBy')($localStorage.companies[$state.params.type], 'distance');
			$scope.companies = tmp;
			$scope.firstLoadDone = true;
			_updateTitle();
		},0);
		
	};

	$scope.delete = function(){
		$scope.companies = [];
		$localStorage.companies[$state.params.type] = [];
		$localStorage.lastItemLoaded[$state.params.type][$state.params.type] = 0;
		$scope.lastItemLoaded = 0;
		$scope.firstElem = 0;
		$scope.lastElement = 0;
		_updateTitle();
	};

	var _updateTitle = function(){
		var title = '';
		switch($state.params.type){
			case ('all'):
				$scope.companyText = 'Todas ( ' + $scope.lastItemLoaded + ' )';
				break;
			case ('following'):
				$scope.companyText = 'Siguiendo ( ' + $scope.lastItemLoaded + ' )';
				break;
			case ('prospects'):
				$scope.companyText = 'Sin web ( ' + $scope.lastItemLoaded + ' )';
				break;
		}
		$scope.lastElement = $scope.lastElement + $scope.paginationItems;
	};

	$scope.refresh = function(){
		$localStorage.lastItemLoaded[$state.params.type] = 0;
		$scope.lastItemLoaded = 0;
		
		$scope.isSearchResult = false;
		$scope.companySearch = '';

		$ionicLoading.show({template: 'Cargando...'});

		var onlyFollowing = (!!$state.params.following),
			companyRef = {};
		
		$scope.companies = [];

		switch ($state.params.type){
			case 'all':
				companyRef = firebase.database().ref('dev/kompassList').orderByChild('distance').limitToFirst($scope.lastElement);
				break;
			case 'prospects':
				companyRef = firebase.database().ref('dev').child('kompassList').orderByChild('web').equalTo(null);
				break;
			case 'following':
				companyRef = firebase.database().ref('dev').child('kompassList').orderByChild('following').equalTo(true);
				break;
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

	};

    $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
    	
    	if ( !$localStorage.companies) $localStorage.companies = {};
    	if ( !$localStorage.lastItemLoaded) $localStorage.lastItemLoaded = {};

    	if ( !!$localStorage.companies && !$localStorage.companies[$state.params.type]) $localStorage.companies[$state.params.type] = [];

    	if ( !!$localStorage.lastItemLoaded && !$localStorage.lastItemLoaded[$state.params.type]) $localStorage.lastItemLoaded[$state.params.type] = 0;

    	if ( !$scope.companies || $scope.companies.length === 0){

    		if ( !!$localStorage.companies && !!$localStorage.companies[$state.params.type] && $localStorage.companies[$state.params.type].length !== 0 ){
    			$scope.companies = $filter('orderBy')($localStorage.companies[$state.params.type], 'distance') || [];	
    		}
    		
    		if ( !!$localStorage.lastItemLoaded ){
    			$scope.lastItemLoaded  = $localStorage.lastItemLoaded[$state.params.type] || 0;
    		}else{
    			$scope.lastItemLoaded  = 0;
    		}
			$scope.firstElem = $scope.lastItemLoaded;
			$scope.lastElement = 0;
			_updateTitle();
    	}

    });
   
}];

app.controller('ListCtrl', listCtrlFn);