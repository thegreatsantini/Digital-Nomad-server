// Include express 
var express = require('express');
var router = express.Router();
// var mongoose = require('mongoose');
var isLoggedIn = require('../middleware/isLoggedIn');
// Include the user model!
var User = require('../models/user');
var Contacts = require('../models/contacts');



// Render the page with the wishlist form
router.get('/', isLoggedIn, function(req, res) {
	Contacts.find({userId: req.user.id}, function (err, contacts) {
		if(err){
			console.log(err);
		} else{
			// console.log(wishes)
			res.render('contacts', {contactList});
		}
	})
	
});
// Save a favorite hike to User's page
router.post('/', function(req, res, next){
	// results = JSON.parse(req.body);
	console.log(req.body);
	console.log(req.user);
	var savedContact = req.body
	savedContact.userId = req.user.id
	Contact.create(req.body, function(err, person) {
		if(!err){
			// res.render("/wishlist");
		}else{
			console.log(err);
		}
	});

});

router.delete('/:id', function(req, res){
	Contacts.findByIdAndRemove(req.params.id, function(err, contacts){
		if(err){
			console.log(err);
		}else {
			res.send()
		}
	})
});



// Allow other files to access the routes defined here
module.exports = router;