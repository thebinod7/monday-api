const ProjectModel = require('../models/projects');

module.exports = {
	listProjects: async () => {
		try {
			return ProjectModel.find();
		} catch (error) {
			throw error;
		}
	},

	getProject: async _id => {
		try {
			return ProjectModel.findById(_id);
		} catch (error) {
			throw error;
		}
	},

	createProject: async args => {
		try {
			console.log('ARGS==>', args);
			const { name, status, dueDate, person, priority } = args;
			return ProjectModel.create({ name, status, dueDate, person, priority });
		} catch (error) {
			throw error;
		}
	},

	deleteProject: async id => {
		try {
			return ProjectModel.findByIdAndDelete(id);
		} catch (error) {
			throw error;
		}
	},

	updateByPulseId: async (pulseId, payload) => {
		try {
			return ProjectModel.findOneAndUpdate({ pulseId }, payload);
		} catch (error) {
			throw error;
		}
	},

	updateProject: async args => {
		try {
			const { id, ...rest } = args;
			return ProjectModel.findByIdAndUpdate(id, { $set: rest }, { new: true });
		} catch (error) {
			throw error;
		}
	}
};
