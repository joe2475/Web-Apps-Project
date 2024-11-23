
# Project 7
## Jordan Frimpter, Joseph Barsis
## JEF180001 JTB170930

## To Run
```npm install --legacy-peers-dep```

```nmp run build:w```

```node webserver.js```

## Notes:

express-async-handler is added. We used this in class and professor recommended it over the async library. (it is better, I implemented both ways.) This has been added to package.json.

There is one lint error that is inescapable from the design of our project due to the context object acting as a wrapper. Using useMemo does not resolve the 'issue'. We believe this to be a limitation of the lint software since it has no knowledge of our intentions to use it in this way.