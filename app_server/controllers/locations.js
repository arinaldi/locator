var request = require('request');
var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://guarded-shelf-90769.herokuapp.com";
}

var _isNumeric = function(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var _formatDistance = function(distance) {
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

var _showError = function(req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404 page not found";
		content = "Locator cannot locate this page. Oh the irony.";
	} else if (status === 500) {
		title = "500 internal server error";
		content = "There's a problem with our server.";
	} else {
		title = status + " something went wrong";
		content = "Generic error message";
	}
	res.status(status);
	res.render('generic-text', {
		title: title,
		content: content
	});
};

var renderHomepage = function(req, res) {
	res.render("locations-list", { 
		title: "Locator - Find a place to work with Wi-Fi",
		pageHeader: {
			title: "Locator",
			tagline: "Find a place to work with Wi-Fi near you."
		},
		sidebar: "Looking for Wi-Fi and a seat? Locator helps you find places to work when you're out and about. Perhaps with coffee, donuts, or a beer? Let Locator help you find the place you're looking for."
	});
};

/* GET 'home' page */
// module.exports.homelist = function(req, res) {
// 	var requestOptions, path;
// 	path = '/api/locations';
// 	requestOptions = {
// 		url: apiOptions.server + path,
// 		method: 'GET',
// 		json: {},
// 		qs: {
// 			lng: -97.740340,
// 			lat: 30.268982,
// 			maxDistance: 20
// 		}
// 	};
// 	request(requestOptions, function(err, response, body) {
// 		var i, data;
// 		data = body;
// 		if (response.statusCode === 200 && data.length) {
// 			for (i = 0; i < data.length; i++) {
// 				data[i].distance = _formatDistance(data[i].distance);
// 			}
// 		}
// 		renderHomepage(req, res, data);
// 	});
// };
module.exports.homelist = function(req, res) {
	renderHomepage(req, res);
};

var getLocationInfo = function(req, res, callback) {
	var requestOptions, path;
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		var data = body;
		if (response.statusCode === 200) {
			data.coords = {
				lng: body.coords[0],
				lat: body.coords[1]
			};
			callback(req, res, data);
		} else {
			_showError(req, res, response.statusCode);
		}
	});
};

var renderDetailPage = function(req, res, locDetail) {
	res.render('location-info', {
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: "is on Locator because it has accessible Wi-Fi and space to sit down with your laptop and get some work done.",
			callToAction: "If you've been and you like it, or if you don't, please leave a review to help other people like you."
		},
		location: locDetail,
		key: 'AIzaSyCfplRcszORTfZJQ4k7LPT64gIW8Mdif84'
	});
}

var renderReviewForm = function(req, res, locDetail) {
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Locator',
		pageHeader: { title: 'Review ' + locDetail.name },
		error: req.query.err,
		url: req.originalUrl
	});
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailPage(req, res, responseData);
	});
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
	getLocationInfo(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
};

/* POST 'Add review' page */
module.exports.doAddReview = function(req, res) {
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + "/reviews";
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};
	requestOptions = {
		url: apiOptions.server + path,
		method: "POST",
		json: postdata
	};
	if (!postdata.author || !postdata.rating || !postdata.reviewText) {
		res.redirect("/location/" + locationid + "/review/new?err=val");
	} else {
		request(requestOptions, function(err, response, body) {
			if (response.statusCode === 201) {
				res.redirect("/location/" + locationid);
			} else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
				res.redirect("/location/" + locationid + "/review/new?err=val");
			} else {
				_showError(req, res, response.statusCode);
			}
		});
	}
};