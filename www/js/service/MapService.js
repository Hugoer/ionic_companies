var mapsServiceFn = ['$ionicLoading','$compile', '$templateRequest',
    function($ionicLoading, $compile, $templateRequest ){

        var createMap = function(position, idMap){
            var myLatlng = new google.maps.LatLng(position.lat,position.lng);
            
            var mapOptions = {
                draggable              : false,
                scrollwheel            : false,
                panControl             : false,
                disableDoubleClickZoom : true,
                center                 : myLatlng,
                zoom                   : 16,
                mapTypeId              : google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(idMap),mapOptions);
            return map;
        };

        var setScrollMap = function(map, scroll){
            map.setOptions({
                draggable   : scroll,
                panControl  : scroll,
                scrollwheel : scroll
            });
        };

        var createMarker = function(position, myMap, title, scope, companyUid, callback){
            
            callback = callback || angular.noop;

            var myLatlng = new google.maps.LatLng(position.lat,position.lng);
            var marker = new google.maps.Marker({
                position : myLatlng,
                map      : myMap,
                title    : title
            });
            // return marker;
            $templateRequest("templates/templatemaps.html")
                .then(function(html){
                    if ( !!scope.markerList && scope.markerList.length !== 0 ){
                        for (var company in scope.markerList) {
                            if (scope.markerList[company].key === companyUid){
                                scope.company = company;
                            }
                        }                        
                    }
                    var template = angular.element(html);
                    // element.append(template);
                    var compiled = $compile(template)(scope);
                    var infowindow = new google.maps.InfoWindow({
                        content: compiled[0]
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(myMap,marker);
                    });
                    callback(marker);
                    // return marker;

                }).catch(function(err){
                    console.log(err);
                    return marker;
                });
        };

        var createArrayMarker = function(array, myMap, scope){
            var objPosition = {},
                arrReturn = [];
            for (var i = 0; i < array.length; i++) {
                if ( !!array[i].value.position ){
                    objPosition = {
                        'lat' : array[i].value.position.latitud,
                        'lng' : array[i].value.position.longitud
                    };
                    //Esta función tiene que ser una promise que sólo se dispae cuando hemos credo y obtenido todos los markers.
                    createMarker(objPosition, myMap, array[i].value.name + ' (' +  array[i].value.description + ')', scope, array[i].key), function(markeerResponse){
                        arrReturn.push(markeerResponse);
                    };
                }
            }
            return arrReturn;
        };

        var createCircle = function(position, myMap, radius){
            return new google.maps.Circle({
                strokeColor   : '#FF0000',
                strokeOpacity : 0.8,
                strokeWeight  : 2,
                fillColor     : '#FF0000',
                fillOpacity   : 0.35,
                map           : myMap,
                center        : position,
                radius        : radius
            });
        };

        var clearMarkers = function( markerArray ){
            if ( !!markerArray ){
                for (var i = 0; i < markerArray.length; i++) {
                    markerArray[i].setMap(null);
                }
            }
        };


        var openGeo = function(address){
            var _url = 'geo://0,0?q=' + address;

            window.open(_url,'_system','location=yes');
        };

        return {
            clearMarkers      : clearMarkers,
            createCircle      : createCircle,
            createMap         : createMap,
            createMarker      : createMarker,
            createArrayMarker : createArrayMarker,
            openGeo : openGeo,
            setScrollMap : setScrollMap

        };
    }
];

app.factory('MapService', mapsServiceFn );