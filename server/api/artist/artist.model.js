'use strict';

import mongoose from 'mongoose';

var ArtistSchema = new mongoose.Schema({
	name: String,
	photo: String,
	info: String,
	email: {
		type: String,
		lowercase: true,
	}
});

export default mongoose.model('Artist', ArtistSchema);