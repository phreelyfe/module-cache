define(function(require){

	var app = angular.module('tn.modules.user', [
			'ui.router',
			require('./user.service').name
		]);

	// Window Factory
	window[ angular.namespace ].make( app );

	app.run(function($rootScope, $state, $window, User){
		$rootScope.message = "User Module Loaded Successfully";

		// Winodw Factory
		window[ angular.namespace ].modules[ app.name ].run = $rootScope;
	});

	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('user', {
				url: '',
				abstract: true,
				template: "<div ui-view='user'></div>"
			})
			.state('user.index', {
				url: '/user', 
				views: {
					'user@user': {
						template: "Working on User Module"
					}
				}
			});
	}]);
	return app;
});