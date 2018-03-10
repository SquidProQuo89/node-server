const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// no arguments need to be passed to create an app
var app = express();


hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');



// make your own middleware -- server logs
app.use((req, res, next) => {
	// human readable timestamp
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`
	console.log(`${now}: ${req.method} ${req.url}`)
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.')
		}
	});

	next();
});

// since this doesn't end with a next() function, nothing below will execute
// if the app.use(express.static(__dirname + '/public')); is above this line
// the public dir will still be accessible. something to keep in mind.
app.use((req, res, next) => {
	res.render('maintenance.hbs', {
		pageTitle: 'Maintenance page',
	});
});

// Syntax to add middleware. Needs absolute path, only needs to
// point to the root directory of your static files.
// eg, using __dirname + '/public/help.html' will fail a GET request
app.use(express.static(__dirname + '/public'));

var testing = (__dirname + '/public/help.html');
console.log(testing);
console.log(__dirname);

// helper function to get current year and pass into templates
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
});

// helper function to capitalize target text
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});


// // set handler for get request
// // callback takes two arguments, one for request and one for response.
// // can pass objects
// app.get('/', (req, res) => {
// 	res.send({
// 		name: 'Taylor',
// 		likes: ['this', 'that', 'the other']
// 	});
// });

// render dynamic templates
app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home page',
		welcomeMessage: 'whats up?'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About page',
		welcomeMessage: 'Help im stuck in a computer' 
	});
});

// one way to send a static response
// app.get('/about', (req, res) => {
// 	res.send('<h1>What you talkin about willis</h1>');
// });

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'OH NO WHAT HAVE YOU DONE???',
		type: 'you done goofed.'
	});
});

var portOne = 3000

// binds app to port on machine
app.listen(portOne, () => {
	console.log(`Server is up on port ${portOne}`)
});