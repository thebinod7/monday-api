const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const graphQlSchema = require('./src/schema');
const graphQlResolvers = require('./src/resolvers/project');

const { createProject, updateByPulseId } = require('./src/resolvers/project');

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 7200;

const EVENTS = {
	CREATE_PULSE: 'create_pulse',
	UPDATE_COLUMN: 'update_column_value'
};

const app = express();

app.use(cors());
app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		graphiql: true // TODO: Enable only in dev mode
	})
);

app.use(express.json());

app.post('/', async (req, res) => {
	const eventData = JSON.stringify(req.body, 0, 2);
	const e = JSON.parse(eventData);
	if (e.event.type === EVENTS.CREATE_PULSE) {
		console.log('Create');
		// await createProject(payload);
	}
	if (e.event.type === EVENTS.UPDATE_COLUMN) {
		console.log('Update');
		// updateByPulseId();
	}
	res.status(200).send(req.body);
});

const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose
	.connect(DB_URL, options)
	.then(() => app.listen(PORT, console.log(`Server running at ${PORT}`)))
	.catch(error => {
		throw error;
	});
