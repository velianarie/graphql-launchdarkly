var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var LaunchDarkly = require('ldclient-node');

var getHive = function() {
  return Promise.resolve(['Hive1', 'Hive2', 'Hive3']);
};

var getSql = function() {
  return Promise.resolve(['Sql1', 'Sql2']);
};

var getPositions = function(args, context) {
  var FEATURE_KEY = 'position-hive';
  var FEATURE_DEFAULT = false;
  var { ldClient, ldUser } = context;
  return ldClient.waitForInitialization()
    .then(function () {
      return ldClient.variation(FEATURE_KEY, ldUser, FEATURE_DEFAULT)
        .then(function (isFeatureOn) {
          if (isFeatureOn) {
            return getHive();
          }
          return getSql();
        });
    });
};

var schema = buildSchema(`
  type Query {
    positions: [String]
  }
`);

var root = {
  positions: getPositions
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
  context: {
    ldClient: LaunchDarkly.init('YOUR_SDK_KEY'),
    ldUser: { key: 'YOUR_USER_ID', name: 'YOUR_USER_NAME' }
  }
}));

app.listen(5000, () => console.log('Express GraphQL Server Running On http://localhost:5000/graphql'));