const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');

const {
	createProject,
	listProjects,
	deleteProject,
	updateProject,
	getProject,
	upsertByrowId
} = require('../resolvers/project');

// Project type blueprint
const ProjectType = new GraphQLObjectType({
	name: 'Project',
	fields: () => ({
		id: { type: GraphQLID },
		rowId: { type: GraphQLID },
		name: { type: GraphQLString },
		status: { type: GraphQLString },
		description: { type: GraphQLString }
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
				rowId: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				status: { type: GraphQLString },
				description: { type: GraphQLString }
			},
			resolve(parent, args) {
				return createProject(args);
			}
		},
		addOrUpdate: {
			type: ProjectType,
			args: {
				rowId: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				status: { type: GraphQLString },
				description: { type: GraphQLString }
			},
			resolve(parent, args) {
				return upsertByrowId(args);
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
				rowId: { type: new GraphQLNonNull(GraphQLString) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				status: { type: GraphQLString },
				description: { type: GraphQLString }
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
