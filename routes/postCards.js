// Include express
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// Include the user model!
const User = require('../models/user');
const Contacts = require('../models/contacts');
const sentCards = require('../models/sentCards')

router.get('/test/:id', function (req, res) {
	res.send(req.params.id)
})
// Render the page with the wishlist form
router.get('/api/v1/:id', function (req, res) {

	sentCards.find({ userId: req.params.id }, function (error, cards) {
		if (error) res.status(404).send('couldn\'t GET user cards');
		else {
			res.send(cards)
		}
	});
});

// username qecs6s3ojedix5py@ethereal.email
// password jsR6XsEvw6Y4zEgtnT 

const sendEmail = (data) => {
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASSWORD)

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: `${process.env.EMAIL_USER}`,
			pass: `${process.env.EMAIL_PASSWORD}`
		}
	});

	var mailOptions = {
		from: process.env.EMAIL_USER,
		to: data.recipients,
		subject: 'You recieved a new post card!',
		text: data.message
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
	return true
}

router.post('/api/v1/:id/add/', async function (req, res) {
	await sendEmail(req.body)
	await (new sentCards(req.body)).save();
	await User.findById(req.params.id, function (err, user) {
		var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
		res.send(token);
	})
});

// Save
// router.post('/api/v1/:id/add/', function (req, res, next) {

// 	// results = JSON.parse(req.body);
// 	// req.body.userId = req.params.id;
// 	console.log("body is", req.body);

// 	User.findById(req.params.id)
// 	.populate('contacts')
// 	.exec(function (error, user) {
// 		if (error) {
// 			console.log(error);
// 			res.status(409).send('couldn\'t GET user info');
// 		}
// 		else {
// 			req.body.userId = user._id;
// 			var contact1 = new Contacts(req.body);
// 			contact1.save();
// 			user.contacts.push(contact1);
// 			user.save().then(function(user2){
// 				var token = jwt.sign(user2.toJSON(), process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 })
// 				res.send(token);
// 			})
// 			.catch(function(err){
// 				res.status(501).send("Save fail");
// 			})

// 		}
// 	});
// });

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
