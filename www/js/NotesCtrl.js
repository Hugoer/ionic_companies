app
.controller('NotesCtrl', function($scope, $ionicLoading, $state, $timeout, CompanyService ) {

	$scope.company = {};
	$scope.company.uid = $state.params.uid;
	$scope.saveNote = function(){
		console.log('Guardando... ' + $scope.noteText);
		var date = new Date().toLocaleString();
		var newNote = {
			'text' : $scope.noteText,
			'date' : date
		};

		var companyRef = firebase.database().ref('dev/kompassList/' + $scope.uid + '/notes/').push(newNote);
		companyRef.then(function(response){
			$scope.noteText = '';
			// $timeout(function(){
				initialize();
			// },0);
		}).catch(function(err){
			console.log(err);
			$scope.noteText = '';
		})
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

	var initialize = function(){
    	var companyUid = $state.params.uid,
    		companyList = {},
    		objNotes = {}, 
    		noteListTmp = [];

		var companyRef = firebase.database().ref('dev/kompassList/' + $scope.uid );
		companyRef.once('value', function(data) {
			$scope.noteList = [];
			companyList = data.val();

			CompanyService.showNotes(companyList,function(response){
				$timeout(function(){
	                $scope.noteList = response;
	            },0);				
			});
		}, function(err){
			$scope.noteList = [];
		}); 
	};
	
	$scope.noteList = [];
	$scope.uid = $state.params.uid;

    $scope.$on( "$ionicView.beforeEnter", function( scopes, states ) {
    	$scope.noteList = [];
    });

	$scope.$on( "$ionicView.enter", function( scopes, states ) {
		initialize();   			
	});

});