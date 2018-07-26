// Include express 
var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var isLoggedIn = require('../middleware/isLoggedIn');
// Include the user model!
var User = require('../models/user');
var Contacts = require('../models/contacts');

router.get('/test/:id', function (req, res) {
	res.send(req.params.id)
})
// Render the page with the wishlist form
router.get('/api/v1/users/:id', function (req, res) {
	User.findById(req.params.id, function (error, user) {
		if (error) res.status(404).send('couldn\'t GET user info');
		else {
			res.send(user.savedContacts)
		}
	});
});

// Save a favorite hike to User's page
router.post('/api/v1/contacts/:id/', function (req, res, next) {
	console.log(req.body)
	// results = JSON.parse(req.body);
	var savedContact = req.body
	savedContact.userId = req.user.id
	Contact.create(req.body, function (err, person) {
		if (!err) {
			// res.render("/wishlist");
		} else {
			console.log(err);
		}
	});

});

router.delete('/:id', function (req, res) {
	Contacts.findByIdAndRemove(req.params.id, function (err, contacts) {
		if (err) {
			console.log(err);
		} else {
			res.send()
		}
	})
});



// Allow other files to access the routes defined here
module.exports = router;