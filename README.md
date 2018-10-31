# graphql-launchdarkly
Demonstrate how to feature toggle an internal working of a graphql endpoint.

## The Toy Example
Graphql query 'positions' returning data coming either from Hive or from SQL.

## Manual Toggling
Use a boolean flag to switch between the two source. 

```
type Query {
  positions(useHive: Boolean!): [String]
}
```

See serverSimple.js

## With LaunchDarkly - Feature Toggle Management
Consumers of this graphql service don't need to know where the data comes from. With LaunchDarkly we could also toggle the data source on the fly and even configure it based on the logged in user.

```
type Query {
  positions: [String]
}
```
[LaunchDarklyConfiguration](../master/LaunchDarklyPositionHive.png?raw=true)

See server.js
