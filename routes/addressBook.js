// Include express 
require('dotenv').config();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
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
	
	// results = JSON.parse(req.body);
	// req.body.userId = req.params.id;
	console.log("body is", req.body);

	User.findById(req.params.id)
	.populate('contacts')
	.exec(function (error, user) {
		if (error) {
			console.log(error);
			res.status(409).send('couldn\'t GET user info');
		}
		else {
			req.body.userId = user._id;
			var contact1 = new Contacts(req.body);
			contact1.save();
			user.contacts.push(contact1);
			user.save().then(function(user2){
				var token = jwt.sign(user2.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
				res.send(token);
			})
			.catch(function(err){
				res.status(501).send("Save fail");
			})
			
		}
	});

	// Contacts.create(req.body, function (err, person) {
	// 	if (err) {
	// 		console.log(err);
	// 		res.status(500).send("Something wrong Happened In POST addressbook");
	// 	} else {
		
			
	// 	}
	// });
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