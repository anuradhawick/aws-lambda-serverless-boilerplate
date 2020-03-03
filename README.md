# aws-lambda-serverless-boilerplate
An easy to use scalable boilerplate for AWS serverless deployment. Contains key artifacts;
1. Router
2. Multiple service handling
3. Database connector
4. Offline Runner  

## Adding services

* Create a folder for service
* Create a `service.yml` inside it
* Make necessary modifications like below
```yaml
# packages to include
package:
  # exclude all folders and files
  exclude:
    - '**/*'
  # include all that is relevant to the service
  include:
    - node_modules/**
    - utils/**
    - second-service/**

service: second-service

functions:
  second-service:
    handler: second-service/second-main.main
    name:  ${self:service}-${opt:stage}
    environment:
      MONGODB_ATLAS_CLUSTER_URI: ${self:custom.env.MONGODB_ATLAS_CLUSTER_URI}
      user_pool_id: ${self:custom.config.user_pool_id}
      BUCKET_NAME: ${self:custom.env.BUCKET_NAME}
      BUCKET_REGION: ${self:custom.env.BUCKET_REGION}
    events:
      - http:
          # implementing GET request to the end point /users of second service.
          # note that we do not have base path PATH1 here since it is not requires as we
          # are already in service of PATH1
          method: get
          path: users
          cors: true
          # Example authorization with a user pool
          authorizer:
            name: vinyl-authorizer
            arn:  ${self:custom.config.userpool_authorizer_arn}
```
* Deploy using command

`serverless deploy --stage STAGE --service SERVICE_FOLDER`

## Using Router

```js

// create router instance
const router = new lambdaRouter.Router(event, context, callback);

// calling route method
// acts as a switch case, pass method, path template string and a handler
// call this router.route function as many times as you like with your methods and paths
// for readability you could implement the function logic in a separate functions file as I have done
router.route(
    'GET',
    '/data',
    (event, context, callback) => {
        first_functions.data(event.queryStringParameters).then((data) => {
            callback(null, lambdaRouter.builResponse(200, {
                ...data,
                success: true
            }))
            }).catch((e) => {
                console.error(e);
                callback(null, lambdaRouter.builResponse(
                        500,  
                        {
                            records: "ERROR",
                            success: false
                        })
                    );
                }
            );
        }
```

## Using DB Connection

* The DB hanlder supports MongoDB
* Simply import the DB hanlder and call connect function.

```js
const db_util = require("../utils/db-util");

const db = await db_util.connect_db(); // returns a promise
```

## Testing offline

* Once a new service is registerd modify the `offline-serverless.js` files services array as follows.

```js
const services = [
  {route:/^\/PATH1/, path:'first-service', port:3001},
  {route:/^\/PATH2/, path:'second-service', port:3002},
  {route:/^\/NEW_PATH/, path:'new-service', port:3003}  // <- New service, new port
];
```

* Use command

`node offline-serverless.js`


