'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookmarkSchema = mongoose.Schema({
	userId: {type: Schema.Types.ObjectId, ref: 'User'}, //store userId's which belong to each user account
	category: {type: String, required: true},
	link: {type: String, required: true},
	description: {type: String, required: true},
	importance: {type: String, required: true},
	knowledge: {type: String, required: true}
});

bookmarkSchema.methods.serialize = function() {

	return {
		category: this.category,
		link: this.link,
		description: this.description,
		importance: this.importance,
		knowledge: this.knowledge,
		created: this._id
	}
}

//Bookmark becomes collection name in database. Behind the scenes, Mongoose works with db.bookmarks for each created.
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = {Bookmark};