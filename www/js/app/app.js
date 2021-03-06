/*
	Here is the entry point for the entire application.
	We want to define our Primary Angular App variable,
	and localize it in a namespace for debugging and testing.
	// factory = require('../modules/window.factory')( app )

	The factory object has a method called make that defines
	a namespace for each other angular module that is a child
	to this primary module
*/
define(function(require){
	
	// Define Angular App
	var app = angular.module( 'tn.modules', [
		'ui.router',
		require('../app/modules/user/user.module').name,
		require('../app/modules/cache/cache.module').name,
		require('../app/modules/parse/parse.module').name
	]);
	// Debugging
	// console.log( $$Ninja );
	// Add This App As Root To The Factory
	// This Object is as good as Window
	window[ angular.namespace ].root( app );

	// App Controller Logic
	app.controller('AppCtrl', ['$scope', function($scope) {
		$scope.title = "App Controller";

		// Custom Window Factory
		window[ angular.namespace ].modules[ app.name ].controllers.appCtrl = $scope;
	}]);

	app.run(function($rootScope, $state, $window, LoginService){
		$rootScope.message = "App Loaded Successfully";
		$rootScope.user = $rootScope.user || {};

		// Key Functions
		
		// Navigate To State
		$rootScope.navigateTo = function( state ) {
			$state.go( state );
			console.log("Navigating You To "+ state);
		};
		// Refresh State
		$rootScope.refresh = function( ) {
			$state.reload();
			console.log("Refreshed State");
		};
		// Complete Reload Window
		$rootScope.reload = function( ) {
			$window.location.reload();
			console.log("Reloaded State");
		};
		// Back Button Function
        $rootScope.goBack = function(){
            console.log(["Going Back In History"]);
            $window.history.back();
        };
        $rootScope.$on('persisted', function( event, saved ){
        	console.info('Persisted: ', saved.Class );
        });
		// Key Listeners
		$rootScope.$on('user:created', function( event, user ){
			// Set a User Object on the RootScope
			$rootScope.user = user;
			LoginService.login( user );
		});
		$rootScope.$on('user:loggedIn', function( event, user ){
			// Set a User Object on the RootScope
			$rootScope.user = user;
			$rootScope.navigateTo('home.index');
		});
		$rootScope.$on('user:loggedOut', function( event, user ){
			// Set a User Object on the RootScope
			$rootScope.user = { username: "VIP"};
			$rootScope.navigateTo('home.index');
		});

		$rootScope.$on('user:updated', function( event, user ){
			// Set a User Object on the RootScope
			$rootScope.user = user;
		});

		// Custom Window Factory
		window[ angular.namespace ].modules[ app.name ].run = $rootScope;
	});

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home', {
				abstract: true,
				template: "<div ui-view='content' id='tnModulesApp' class='main-body'></div>"
			})
			.state('home.index', {
				url: '/', 
				views: {
					'content@home': {
						templateUrl: './js/app/index.html'
					}
				}
			});

		$urlRouterProvider.otherwise('/');
	}]);

	return app;
});