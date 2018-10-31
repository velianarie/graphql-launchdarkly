var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var getHive = function() {
  return Promise.resolve(['Hive1', 'Hive2', 'Hive3']);
};

var getSql = function() {
  return Promise.resolve(['Sql1', 'Sql2']);
};

var getPositions = function(args) {
  if (args.useHive) {
    return getHive();
  }
  return getSql();
};

var schema = buildSchema(`
  type Query {
    positions(useHive: Boolean!): [String]
  }
`);

var root = {
  positions: getPositions
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(5000, () => console.log('Express GraphQL Server Running On http://localhost:5000/graphql'));