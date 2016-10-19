var mapsServiceFn = ['$ionicLoading','$compile', '$templateRequest',
    function($ionicLoading, $compile, $templateRequest ){

        var createMap = function(position, idMap){
            var myLatlng = new google.maps.LatLng(position.lat,position.lng);
            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(idMap),mapOptions);
            return map;
        };

        var createMarker = function(position, myMap, title, scope){
            var myLatlng = new google.maps.LatLng(position.lat,position.lng);
            marker = new google.maps.Marker({
                position : myLatlng,
                map      : myMap,
                title    : title
            });
            return marker;
            // $templateRequest("templates/templatemaps.html")
            //     .then(function(html){
            //         var template = angular.element(html);
            //         // element.append(template);
            //         var compiled = $compile(template)(scope);
            //         var infowindow = new google.maps.InfoWindow({
            //             content: compiled[0]
            //         });

            //         google.maps.event.addListener(marker, 'click', function() {
            //             infowindow.open(myMap,marker);
            //         });
                    
            //         return marker;

            //     }).catch(function(err){
            //         console.log(err);
            //         return marker;
            //     });
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
            for (var i = 0; i < markerArray.length; i++) {
                markerArray[i].setMap(null);
            }
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
                    arrReturn.push( createMarker(objPosition, myMap, array[i].value.name + ' (' +  array[i].value.description + ')', scope) );
                }
            }
            return arrReturn;
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
            openGeo : openGeo

        };
    }
];

app.factory('MapService', mapsServiceFn );