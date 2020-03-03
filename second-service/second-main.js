'use strict';
const lambdaRouter = require('../utils/lambda-router');
const second_functions = require('./second-functions');

exports.main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const router = new lambdaRouter.Router(event, context, callback);

  /**
   * get users
   */
  router.route(
    'GET',
    '/users',
    (event, context, callback) => {
      second_functions.users(event.queryStringParameters).then((data) => {
        callback(null, lambdaRouter.builResponse(200, {
          data,
          success: true
        }))
      }).catch((e) => {
        console.error(e)
        callback(null, lambdaRouter.builResponse(500, {
          records: "ERROR",
          success: false
        }))
      });

    }
  );
};
