const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType
} = require('graphql');

const { createProject, listProjects, deleteProject, updateProject, getProject } = require('../resolvers/project');

// Client type blueprint
const ClientType = new GraphQLObjectType({
	name: 'Client',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString }
	})
});

// Project type blueprint
const ProjectType = new GraphQLObjectType({
	name: 'Project',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		status: { type: GraphQLString },
		person: { type: GraphQLString },
		priority: { type: GraphQLString },
		dueDate: { type: GraphQLString }
	})
});

// List of query commands i.e. READ
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		listProjects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return listProjects();
			}
		},
		getProject: {
			type: ProjectType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return getProject(args.id);
			}
		}
	}
});

// List of mutation commands i.e. WRITE
const mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addProject: {
			type: ProjectType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				person: { type: GraphQLString },
				dueDate: { type: GraphQLString },
				status: { type: GraphQLString },
				priority: { type: GraphQLString }
				// status: {
				// 	type: new GraphQLEnumType({
				// 		name: 'ProjectStatus',
				// 		values: {
				// 			working_on_it: { value: 'Working on it' },
				// 			stuck: { value: 'Stuck' },
				// 			done: { value: 'Done' }
				// 		}
				// 	}),
				// 	defaultValue: 'Working on it'
				// },
				// priority: {
				// 	type: new GraphQLEnumType({
				// 		name: 'ProjectPriority',
				// 		values: {
				// 			critical: { value: 'Critical' },
				// 			high: { value: 'High' },
				// 			medium: { value: 'Medium' },
				// 			low: { value: 'Low' }
				// 		}
				// 	}),
				// 	defaultValue: 'Medium'
				// }
			},
			resolve(parent, args) {
				return createProject(args);
			}
		},
		deleteProject: {
			type: ProjectType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				return deleteProject(args.id);
			}
		},
		updateProject: {
			type: ProjectType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: 'ProjectUpdateStatus',
						values: {
							not_started: { value: 'Not Started' },
							progress: { value: 'In Progress' },
							completed: { value: 'Completed' }
						}
					}),
					defaultValue: 'Not Started'
				},
				client: { type: GraphQLID }
			},
			resolve(parent, args) {
				return updateProject(args);
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation
});
