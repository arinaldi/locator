(function() {
	angular
		.module("locatorApp")
		.controller("reviewModalCtrl", reviewModalCtrl);

	reviewModalCtrl.$inject = ["$modalInstance", "locatorData", "locationData"];
	function reviewModalCtrl($modalInstance, locatorData, locationData) {
		var vm = this;
		vm.locationData = locationData;

		vm.onSubmit = function() {
			vm.formError = "";
			if (!vm.formData.rating || !vm.formData.reviewText) {
				vm.formError = "All fields are required. Try again.";
				return false;
			} else {
				vm.doAddReview(vm.locationData.locationid, vm.formData);
			}
		};

		vm.doAddReview = function(locationid, formData) {
			locatorData.addReviewById(locationid, {
				rating: formData.rating,
				reviewText: formData.reviewText
			})
				.success(function(data) {
					vm.modal.close(data);
				})
				.error(function(data) {
					vm.formError = "Your review has not been saved. Try again.";
				});
			return false;
		};

		vm.modal = {
			close: function(result) {
				$modalInstance.close(result);
			},
			cancel: function() {
				$modalInstance.dismiss("cancel");
			}
		};
	}
})();