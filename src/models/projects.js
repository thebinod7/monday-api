const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
	{
		name: { type: String, required: true },
		status: { type: String, enum: ['Pending', 'Working on it', 'Stuck', 'Done'], default: 'Pending' },
		description: String
	},
	{ collection: 'projects', timestamps: true }
);

module.exports = mongoose.model('Project', schema);
