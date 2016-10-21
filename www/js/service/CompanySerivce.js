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

        };

        var showNotes = function(companyUid, callback){
            // var noteListTmp = [];
            // for (var comp in companyList.notes) {
            //     objNotes = {
            //         'uid' : comp,
            //         'value' : companyList.notes[comp],
            //     };
            //     noteListTmp.push(objNotes);
            // }
            // callback(noteListTmp);
            var noteListTmp = [],
                objNotes = {};
            var result = firebase.database().ref('dev/kompassList/' + companyUid + '/notes/');
            result.once('value', function(response) {
                response.forEach(function(item){
                    objNotes = {
                        'uid' : item.key,
                        'value' : item.val(),
                    };
                    noteListTmp.push(objNotes);
                });
                callback(noteListTmp);                
            }, function(err){
                failure(err);
            });

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