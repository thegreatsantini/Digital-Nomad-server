// Include express
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Include the user model!
const User = require('../models/user');
const Contacts = require('../models/contacts');

router.get('/api/v1/contact/:id', function (req, res) {
	Contacts.findById(req.params.id, function (err, contact) {
		res.send(contact)
	})
})

const createContactsArray = async (contacts) => {
	let contactList = [];
	for (let i = 0; i < contacts.length; i++) {

		await Contacts.findById({ _id: contacts[i] }, function (err, contact) {
			if (err) { console.log('oh boy somthing happend') }
			else if (contact !== null) {
				contactList.push(contact);
			}
		})
	}
	return contactList
};

// Get all contacts for one User
router.get('/api/v1/contacts/:id', function (req, res) {
	console.log('************', req.params.id)
	User.findById(req.params.id, async function (error, user) {
		if (error) res.status(404).send('couldn\'t GET user info');
		else {
			// create array of objects for users saved contacts
			let userContacts = await createContactsArray(user.contacts)
			// console.log(userContacts)
			res.send(userContacts)
		}
	});
});

// Get one contact from its :id and update
router.put('/api/v1/contacts/update/:id/', function (req, res) {

	Contacts.findByIdAndUpdate(req.params.id, { $set: req.body }, function (err, contact) {
		if (err) {
			console.log('eerrroor', err)
			res.send('Couldnt get contact', err);
		}
		else {
			console.log('**************', req.params.id)
			// User.findById(req.params.id, function (err, user) {
			// 	var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
				// res.send(token);
			// })
			res.send(contact)
		}
	})
});

// Change route maybe
router.post('/api/v1/contacts/:id/', function (req, res, next) {
	console.log('HELLO FROM SERVER', req.params.id)
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
				user.save().then(function (user2) {
					console.log(user2.toJSON())
					var token = jwt.sign(user2.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
					res.send(token);
				})
					.catch(function (err) {
						res.status(501).send("Save fail");
					})

			}
		});
});

router.delete('api/v1/:id/remove/:contact', async function (req, res) {
	Contacts.findByIdAndRemove(req.params.contact, function (err, contacts) {
		if (err) {
			console.log(err);
		} else {
			res.send()
		}
	})
});



// Allow other files to access the routes defined here
module.exports = router;
