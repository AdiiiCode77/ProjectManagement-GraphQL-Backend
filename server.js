const express = require('express');
require('dotenv').config();
const {graphqlHTTP} = require('express-graphql');
const cors = require('cors');
const schema = require('./schema/schema');
const ConnectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

ConnectDB();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(PORT,()=>{
    console.log('Server is Running on port', PORT)
}
);
