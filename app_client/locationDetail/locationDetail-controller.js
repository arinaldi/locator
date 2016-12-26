(function() {
	angular
		.module("locatorApp")
		.controller("locationDetailCtrl", locationDetailCtrl);

	locationDetailCtrl.$inject = ["$routeParams", "$modal", "locatorData"];
	function locationDetailCtrl($routeParams, $modal, locatorData) {
		var vm = this;
		vm.locationid = $routeParams.locationid;

		locatorData.locationById(vm.locationid)
			.success(function(data) {
				vm.data = {
					location: data
				};
				vm.pageHeader = {
					title: vm.data.location.name
				};
			})
			.error(function(e) {
				console.log(e);
			});

		vm.popupReviewForm = function() {
			var modalInstance = $modal.open({
				templateUrl: "/reviewModal/reviewModal-view.html",
				controller: "reviewModalCtrl as vm",
				resolve: {
					locationData: function() {
						return {
							locationid: vm.locationid,
							locationName: vm.data.location.name
						};
					}
				}
			});

			modalInstance.result.then(function(data) {
				vm.data.location.reviews.push(data);
			});
		};
	}
})();