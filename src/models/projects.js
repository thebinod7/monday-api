const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
	{
		pulseId: { type: String, required: true },
		name: { type: String, required: true },
		status: { type: String, enum: ['Pending', 'Working on it', 'Stuck', 'Done'], default: 'Pending' },
		person: [{ id: String, kind: String, _id: false }],
		dueDate: Number,
		priority: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'None'], default: 'None' }
	},
	{ collection: 'projects', timestamps: true }
);

module.exports = mongoose.model('Project', schema);
