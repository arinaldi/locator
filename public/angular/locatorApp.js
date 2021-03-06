angular.module("locatorApp", []);

var _isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function() {
	return function(distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = 'km';
			} else {
				numDistance = parseInt(distance * 1000, 10);
				unit = 'm';
			}
			return numDistance + ' ' + unit;
		} else {
			return "?";
		}
	};
};

var ratingStars = function() {
	return {
		scope: {
			thisRating: "=rating"
		},
		templateUrl: "/angular/rating-stars.html"
	};
};

var geolocation = function() {
	var getPosition = function(cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		} else {
			cbNoGeo();
		}
	};
	return {
		getPosition: getPosition
	};
};

var locationListCtrl = function($scope, locatorData, geolocation) {
	$scope.message = "Checking your location...";

	$scope.getData = function(position) {
		var lat = position.coords.latitude,
			lng = position.coords.longitude;
		$scope.message = "Searching for places nearby";
		locatorData.locationByCoords(lat, lng)
			.success(function(data) {
				$scope.message = data.length > 0 ? "" : "No locations found";
				$scope.data = {
					locations: data
				};
			})
			.error(function(e) {
				$scope.message = "Something went wrong";
			});
	};

	$scope.showError = function(error) {
		$scope.$apply(function() {
			$scope.message = error.message;
		});
	};

	$scope.noGeo = function() {
		$scope.$apply(function() {
			$scope.message = "Geolocation is not supported by this browser.";
		});
	};

	geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};

var locatorData = function($http) {
	var locationByCoords = function(lat, lng) {
		return $http.get("/api/locations?lng=" + lng + "&lat=" + lat + "&maxDistance=20");
	};
	return {
		locationByCoords: locationByCoords
	}
};

angular
	.module("locatorApp")
	.controller("locationListCtrl", locationListCtrl)
	.filter("formatDistance", formatDistance)
	.directive("ratingStars", ratingStars)
	.service("locatorData", locatorData)
	.service("geolocation", geolocation);