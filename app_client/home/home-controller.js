(function() {
	angular
		.module("locatorApp")
		.controller("homeCtrl", homeCtrl);

	homeCtrl.$inject = ["$scope", "locatorData", "geolocation"];
	function homeCtrl($scope, locatorData, geolocation) {
		var vm = this;
		vm.pageHeader = {
			title: "Locator",
			tagline: "Find a place to work with Wi-Fi near you."
		};
		vm.sidebar = {
			content: "Looking for Wi-Fi and a seat? Locator helps you find places to work when you're out and about. Perhaps with coffee, donuts, or a beer? Let Locator help you find the place you're looking for."
		};
		vm.message = "Checking your location...";
		vm.getData = function(position) {
			var lat = position.coords.latitude,
				lng = position.coords.longitude;
			vm.message = "Searching for places nearby";
			locatorData.locationByCoords(lat, lng)
				.success(function(data) {
					vm.message = data.length > 0 ? "" : "No locations found";
					vm.data = {
						locations: data
					};
				})
				.error(function(e) {
					vm.message = "Something went wrong";
				});
		};

		vm.showError = function(error) {
			$scope.$apply(function() {
				vm.message = error.message;
			});
		};

		vm.noGeo = function() {
			$scope.$apply(function() {
				vm.message = "Geolocation is not supported by this browser.";
			});
		};

		geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);
	}
})();