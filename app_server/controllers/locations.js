/* GET 'home' page */
module.exports.homelist = function(req, res) {
	res.render('locations-list', { 
		title: 'Locator - Find a place to work with Wi-Fi',
		pageHeader: {
			title: 'Locator',
			tagline: 'Find a place to work with Wi-Fi near you.'
		},
		sidebar: 'Looking for Wi-Fi and a seat? Locator helps you find places to work when you\'re out and about. Perhaps with coffee, donuts, or a beer? Let Locator help you find the place you\'re looking for.',
		locations: [{
			name: 'Tony\'s Teas',
			address: '222 Tacoma Street, Austin, TX 78701',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium Wi-Fi'],
			distance: '400m'
		}, {
			name: 'Tina\'s Tacos',
			address: '2013 Dorchester Boulevard, Austin, TX 78702',
			rating: 4,
			facilities: ['Cold drinks', 'Tex-Mex food', 'Premium Wi-Fi'],
			distance: '800m'
		}, {
			name: 'Shiloh\'s Snack Shack',
			address: '2008 Fetching Circle, Austin, TX 78703',
			rating: 5,
			facilities: ['Water', 'Treats', 'Premium Wi-Fi'],
			distance: '1600m'
		}]
	});
};

/* GET 'Location info' page */
module.exports.locationInfo = function(req, res) {
	res.render('location-info', {
		title: 'Tony\'s Teas',
		pageHeader: {title: 'Tony\'s Teas'},
		sidebar: {
			context: 'is on Locator because it has accessible Wi-Fi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it, or if you don\'t, please leave a review to help other people like you.'
		},
		location: {
			name: 'Tony\'s Teas',
			address: '222 Tacoma Street, Austin, TX 78701',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium Wi-Fi'],
			coords: {lat: 30.267153, lng: -97.74306079999997},
			openingTimes: [{
				days: 'Monday - Friday',
				opening: '7:00 a.m.',
				closing: '7:00 p.m.',
				closed: false
			}, {
				days: 'Saturday',
				opening: '8:00 a.m.',
				closing: '5:00 p.m.',
				closed: false
			}, {
				days: 'Sunday',
				closed: true
			}],
			reviews: [{
				author: 'Meow Meow',
				rating: 4,
				timestamp: 'December 3, 2016',
				reviewText: 'My go-to stop to groom myself.'
			}, {
				author: 'Ray Raisin',
				rating: 2,
				timestamp: 'January 31, 2017',
				reviewText: 'It was okay. The tea was good, but there were no treats!'
			}]
		}
	});
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res) {
	res.render('location-review-form', {
		title: 'Review Tony\'s Teas on Locator',
		pageHeader: { title: 'Review Tony\'s Teas' }
	});
};