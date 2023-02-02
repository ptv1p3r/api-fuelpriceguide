const AWS = require("aws-sdk");

AWS.config.region = 'eu-west-1';

let globalContext;

/** Lambda responsible for retrieving user information deliver it to the operator bo management
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
exports.handler = async (event, context, callback) => {
    let apiResponse = null;
    let responseObject = {
        Code : "",
        Message : ""
    };

    globalContext = context;

    try {
        // Validation if parameters are being sent in API Gateway's side
        const registers = event.register;
        const applicationId = event.applicationId.trim();
        const operationType = event.operationType.trim();
        const operationTimestamp = event.operationTimestamp.trim();

        responseObject = {
            Code : 200,
            Message : "All good"
        }

        callback(null, responseObject);

    } catch (err){
        responseObject = {
            Code : 400,
            Message : "Errors detected"
        }

        console.error('Error: ' + err.errorMessage);
        console.error('Events: ' + JSON.stringify(event));
        callback(responseObject);
    }
};

