// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', [
    'ionic',
    'ngStorage',
    'ionic-native-transitions'
])

.run(function($ionicPlatform, $ionicLoading, $rootScope) {

    var 
    config = {
        apiKey            : 'AIzaSyA-3mJbCQLOgs241Vl_urLVcJD9YS9jo3k',
        authDomain        : 'empresasvigo-90094.firebaseapp.com',
        databaseURL       : 'https://empresasvigo-90094.firebaseio.com',
        storageBucket     : 'empresasvigo-90094.appspot.com',
        messagingSenderId : '783868608028'
    };
    
    firebase.initializeApp(config);

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
        // $ionicLoading.show({template: 'Cargando...'});
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, options){
        // $ionicLoading.hide();
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options){
        // $ionicLoading.hide();
    });


    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicNativeTransitionsProvider, $compileProvider, $ionicConfigProvider) {

    $ionicNativeTransitionsProvider.setDefaultOptions({
        duration                : 200, // in milliseconds (ms), default 400,
        slowdownfactor          : 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay                : -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay            : -1, // same as above but for Android, default -1
        winphonedelay           : -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop          : 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom       : 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent  : '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection : false // Takes over default back transition and state back transition to use the opposite direction transition to go back
    });

    $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
    });

    $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
    });

    $ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $compileProvider.debugInfoEnabled(false);


  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  .state('app.prospects', {
    url: '/prospects',
    params : {'type' : 'prospects'},
    views: {
      'menuContent': {
        templateUrl: 'templates/companies.html',
        controller : 'ListCtrl'
      }
    }
  })
  .state('app.all', {
    url: '/all',
    params : {'type' : 'all'},
    views: {
      'menuContent': {
        templateUrl: 'templates/companies.html',
        controller : 'ListCtrl'
      }
    }
  })
  .state('app.following', {
    url: '/following',
    params : {'type' : 'following'},
    views: {
      'menuContent': {
        templateUrl: 'templates/companies.html',
        controller : 'ListCtrl'
      }
    }
  })
  .state('app.company', {
    url: '/company/:info',
    views: {
      'menuContent': {
        templateUrl: 'templates/company.html',
        controller: 'CompanyCtrl'
      }
    }
  })
  .state('app.notes', {
    url: '/notes/:uid',
    views: {
      'menuContent': {
        templateUrl: 'templates/notes.html',
        controller: 'NotesCtrl'
      }
    }    

  })
  .state('app.map', {
    url: '/map',
    views: {
      'menuContent': {
        templateUrl: 'templates/map.html',
        controller : 'MapCtrl'
      }
    }
  })
  .state('app.calendar', {
    url: '/calendar',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendar.html',
        controller : 'CalendarCtrl'
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/prospects');
});
