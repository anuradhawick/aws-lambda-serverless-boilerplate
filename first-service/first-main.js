'use strict';
const lambdaRouter = require('../utils/lambda-router');
const first_functions = require('./first-functions');

exports.main = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const router = new lambdaRouter.Router(event, context, callback);

  /**
   * get data
   */
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
        console.error(e)
        callback(null, lambdaRouter.builResponse(500, {
          records: "ERROR",
          success: false
        }))
      });

    }
  );

  /**
   * get data by task id
   */
  router.route(
    'GET',
    '/data/{taskId}',
    (event, context, callback) => {
      first_functions.data(event.queryStringParameters).then((data) => {
        callback(null, lambdaRouter.builResponse(200, {
          ...data,
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
