(function() {
	angular.module("locatorApp", ["ngRoute"]);

	function config ($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: "home/home-view.html",
				controller: "homeCtrl",
				controllerAs: "vm"
			})
			.otherwise({
				redirectTo: "/"
			});
	}

	angular
		.module("locatorApp")
		.config(["$routeProvider", config]);
})();