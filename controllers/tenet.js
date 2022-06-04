const Googleuser = require('../models/googleuser');
const Event = require('../models/event');

/** @type {import('express').RequestHandler} */
exports.getIndex = (req, res) => {
	console.log(req.isAuthenticated());
	let eventsData = {};
	return Event.find()
		.then(events => {
			console.log('Events Data: ');
			console.log(events);
			eventsData = events;
			if (!req.isAuthenticated() || !req.user) {
				return {};
			}
			return req.user
				.populate('registeredEvents.events.event')
				.execPopulate();
		})
		.then(user => {
			if (!req.isAuthenticated() || !req.user) {
				return res.render('index', {
					isAuthenticated: false,
					user: {},
					events: eventsData,
				});
			}
			console.log('User Data: ');
			console.log(user);
			return res.render('index', {
				isAuthenticated: true,
				user,
				events: eventsData,
			});
		})
		.catch(err => {
			console.log('Error at main page: ', err);
			res.redirect('/logout');
		});

	// if (req.session.messages) {
	// 	let msg = req.session.messages[0];
	// 	delete req.session.messages;
	// 	return res.send(msg);
	// }
	// res.render('index', { isAuthenticated: req.isAuthenticated(), user,  });
};
