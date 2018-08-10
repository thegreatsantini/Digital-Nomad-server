// Include express 
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Include the user model!
const User = require('../models/user');
const Contacts = require('../models/contacts');

router.get('/test/:id', function (req, res) {
	res.send(req.params.id)
})

const createContactsArray = async (contacts) => {
	let contactList = [];
	for (let i = 0; i < contacts.length; i++) {
		
		await Contacts.findById({ _id: contacts[i] }, function(err, contact) {
			if (err) { console.log('oh boy somthing happend') }
			else if ( contact !== null ) {  
				contactList.push(contact);
			}
		})
	}
	return contactList
};

// Get all contacts for one User
router.get('/api/v1/contacts/:id', function (req, res) {

	User.findById(req.params.id, async function (error, user) {
		if (error) res.status(404).send('couldn\'t GET user info');
		else {
			// create array of objects for users saved contacts
			let userContacts = await createContactsArray(user.contacts)
			
			res.send(userContacts)
		}
	});
});

// Get one contact from its :id
router.get('/api/v1/contact/:id', function(req,res){
	Contacts.findById( req.params.id, function(err, contact) {
		if ( err ) {
			res.send('Couldnt get contact', err);
		}
		else {
			res.send(contact)
		}
	})
});

// Change route maybe
router.post('/api/v1/contacts/:id/', function (req, res, next) {
	
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
});

router.get('/api/v1/contacts/:id/update/:address/', async function(req, res) {
	// Contacts.findByIdAndUpdate({_id:req.params.address}, function(err, contact){
	// 	if(err) {
	// 		console.log('Error in contact Update', err);
	// 		res.send('Error in update Contact', err)
	// 	} else {
			res.send('This is the update route', req.body)
	// 	}
	// })
})

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