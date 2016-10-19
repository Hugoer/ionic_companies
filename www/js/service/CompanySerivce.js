var companyServiceFn = ['$ionicLoading',
    function($ionicLoading  ){

        var setFollowing = function( companyUid, value, callback, failure ){

            callback = callback || angular.noop;
            failure = failure || angular.noop;

            var result = firebase.database().ref('dev/kompassList/' + companyUid + '/following').set(value);
            result.then(function(response){
                callback(response);
            }).catch(function(err){
                failure(err);
            });

        }

        var showNotes = function(companyList, callback){
            var noteListTmp = [];
            for (comp in companyList.notes) {
                objNotes = {
                    'uid' : comp,
                    'value' : companyList.notes[comp],
                };
                noteListTmp.push(objNotes);
            }
            // $timeout(function(){
            //     $scope.noteList = noteListTmp;
            // },0);
            callback(noteListTmp);
        };

        var hideNote = function(companyUid, note, callback, failure){

            callback = callback || angular.noop;
            failure = failure || angular.noop;
            
            var value = {
                'hidden' : true
            };

            var result = firebase.database().ref('dev/kompassList/' + companyUid + '/notes/' + note).child('hidden').set(true);
            result.then(function(response){
                callback(response);
            }).catch(function(err){
                failure(err);
            });
        };

        return {
            hideNote: hideNote,
            setFollowing : setFollowing,
            showNotes : showNotes
        };
    }
];

app.factory('CompanyService', companyServiceFn );