const API = require('./helpers/api-helper')("GET");

let globalContext;

/** Lambda responsible for retrieving
 *
 * @param {Object} event - contains the Body content of the HTTP request.
 * @param {Array}  event.register - Client unique identifier
 * @param {String} event.applicationId - Application unique identifier
 * @param {String} event.operationType - Operation identifier
 * @param {String} event.operationTimestamp - Operation Timestamp identifier
 * @param {Object} context - Lambda-specific
 * @param callback
 *
 */
exports.handler = (event, context, callback) => {
    let apiResponse = null;
    let responseObject;

    globalContext = context;

    try {

        responseObject = {
            Code : 200,
            Message : "All good",
        };

        apiResponse = API.buildResponse(API.RESPONSE.SUCCESS, context, responseObject);

        callback(null, apiResponse);

    } catch ( err ) {
        apiResponse = API.buildResponse(API.RESPONSE.INTERNAL_SERVER_ERROR, context);

        console.error('Error: ' + err);
        console.error('Events: ' + JSON.stringify(event));

        callback(apiResponse.error);
    }

};

