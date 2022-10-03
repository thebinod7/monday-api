const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
	{
		pulseId: { type: String, required: true },
		name: { type: String, required: true },
		status: { type: String, enum: ['Working on it', 'Stuck', 'Done'], default: 'Working on it' },
		person: String,
		dueDate: Date,
		priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' }
	},
	{ collection: 'projects', timestamps: true }
);

module.exports = mongoose.model('Project', schema);
