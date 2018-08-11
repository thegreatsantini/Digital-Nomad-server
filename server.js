// Modules I need for running this app
require('dotenv').config(); // Loads the .env
var bodyParser = require('body-parser');
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var expressJWT = require('express-jwt');
var logger = require('morgan');
var path = require('path');
var app = express();

// Connect to the database

mongoose.connect('mongodb://localhost:27017/digitalNomad', { useNewUrlParser: true });

// Set up middleware
app.use(logger('dev'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Controllers
app.use('/auth', expressJWT({
	secret: process.env.JWT_SECRET,
	getToken: function fromRequest(req) {
		if (req.body.headers && req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[0] === 'Bearer') {
			return req.body.headers.Authorization.split(' ')[1];
		}
		return null;
	}
}).unless({
	path: [
		{ url: '/auth/login', methods: ['POST'] },
		{ url: '/auth/signup', methods: ['POST'] }
	]
}), require('./routes/auth'));

// Top-level Routes
app.get('/', function (req, res) {
	res.send('landing page');
});

app.use('/profile', require('./routes/profile'));
app.use('/addressbook', require('./routes/addressBook'));
app.use('/postcards',require('./routes/postCards'))

// Set the port
const PORT = process.env.PORT || 8080

// Listen
app.listen(PORT, () => {
    console.log(`app is locked and loaded at port: ${PORT}`)
});

