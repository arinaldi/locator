(function() {
	angular
		.module("locatorApp")
		.service("locatorData", locatorData);

	locatorData.$inject = ["$http", "authentication"];
	function locatorData($http, authentication) {
		var locationByCoords = function(lat, lng) {
			return $http.get("/api/locations?lng=" + lng + "&lat=" + lat + "&maxDistance=99999");
		};

		var locationById = function(locationid) {
			return $http.get("/api/locations/" + locationid);
		};

		var addReviewById = function(locationid, data) {
			return $http.post("/api/locations/" + locationid + "/reviews", data, {
				headers: {
					Authorization: "Bearer " + authentication.getToken()
				}
			});
		};

		return {
			locationByCoords: locationByCoords,
			locationById: locationById,
			addReviewById: addReviewById
		};
	}
})();