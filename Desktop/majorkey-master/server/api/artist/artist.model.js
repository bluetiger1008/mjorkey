'use strict';

import mongoose from 'mongoose';

var ArtistSchema = new mongoose.Schema({
	name: String,
	photo: String,
	info: String,
	email: {
		type: String,
		lowercase: true,
	},
  	price: Number
});

export default mongoose.model('Artist', ArtistSchema);
