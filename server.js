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

mongoose.connect('mongodb://superuser:Ubatuba!22@ds051923.mlab.com:51923/digital-nomad', { useNewUrlParser: true });

// Set up middleware
app.use(logger('dev'));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const getToken = function(req) {
	// console.log('Authorization token, getting token');
	// console.log(req.headers.authorization);
	const headers = req.body.headers || req.headers;
	const auth = headers.Authorization || headers.authorization;
	if (auth && auth.split(' ')[0] === 'Bearer') {
		return auth.split(' ')[1];
	}
	return null;
}

// Controllers
app.use('/auth', expressJWT({
	secret: process.env.JWT_SECRET,
	getToken: getToken
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

app.use('/profile', expressJWT({secret: process.env.JWT_SECRET, getToken: getToken}), require('./routes/profile'));
app.use('/addressbook', expressJWT({secret: process.env.JWT_SECRET, getToken: getToken}), require('./routes/addressBook'));
app.use('/postcards', expressJWT({secret: process.env.JWT_SECRET, getToken: getToken}), require('./routes/postCards'))

// Set the port
const PORT = 8080

// Listen
app.listen(PORT, () => {
    console.log(`app is locked and loaded at port: ${PORT}`)
});

