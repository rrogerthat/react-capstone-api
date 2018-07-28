'use strict';

const { Bookmark } = require('./models');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

mongoose.Promise = global.Promise;

const router = express.Router(); 
router.use(bodyParser.json());

router.get('/api', (req, res) => {		//route would be /items/api
	res.json({ok: true});
});

//display bookmarks by category
router.get('/:category', jwtAuth, (req, res) => {	//request to /items/:category
	Bookmark
	.find( {category: req.params.category, userId: req.user.id} )
	.then(items => {
		res.json({
			bookmarks: items.map(item => {	
				return item.serialize();	
			})  
		})
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({ message: 'Internal server error' });
	});
});

//post a bookmark
router.post('/entry', jwtAuth, (req, res) => {		//route is /items/entry
	console.log(req.body);
	const requiredFields = ['category', 'link', 'description', 'importance', 'knowledge'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const message = `Missing \'${field}\' entry in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	console.log(req.user)
	Bookmark
	.create({
		userId: req.user.id,	//so user accesses only his data
		category: req.body.category,
		link: req.body.link,	
		description: req.body.description,
		importance: req.body.importance,
		knowledge: req.body.knowledge
	})
	.then(bookmark => res.status(201).json(bookmark.serialize()))
	.catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

//to update a bookmark 
router.put('/update/:id',  (req, res) => {
	// if (!(req.params.id && req.body.id && req.params.id  === req.body.id)) { //make sure ID's are entered and matched.
	// 	const message = (
 //      		`Request path id (${req.params.id}) and request body id ` +
 //      		`(${req.body.id}) must match`);
 //    	console.error(message);
 //    	return res.status(400).json({ message: message });
 //  	}

  	const toUpdate = {};
  	const updateableFields = ['category', 'link', 'description', 'importance', 'knowledge'];

  	updateableFields.forEach(field => {
  		if (field in req.body) {
  			toUpdate[field] = req.body[field];	//creating new updated obj with key/value pairs.
  		}
  	});

  	Bookmark
  	.findByIdAndUpdate(req.params.id, { $set: toUpdate }) 
  	.then(bookmark => res.status(200).json(bookmark.serialize())) //actually provides non-updated item back
  	.catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/entry/:id', jwtAuth, (req, res) => {	//route is /items/entry/:id
	Bookmark
	.findByIdAndRemove(req.params.id)
	.then(expense => res.status(204).end()) //if wrong ID, no error msg
	.catch(err => res.status(500).json({ message: 'Internal server error' }));
});

//requests to nonexisting endpoints
router.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = {router};