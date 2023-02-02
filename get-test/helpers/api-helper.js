
/**
 * @file
 * Provides helper methods for API development.
 * 
*/


// -------------------- Dependencies --------------------

// Example: var variable = require("module");


// -------------------- Global variables --------------------

// Constants
// const GLOBAL_CONSTANT = "CONSTANT_VALUE";
const SUPPORTED_METHOD = {
    GET: {
        NAME: "GET",
        RESPONSE: {
            SUCCESS: "SUCCESS",
            SUCCESS_FUNCTIONAL_ERROR: "SUCCESS_FUNCTIONAL_ERROR",
            BAD_REQUEST: "BAD_REQUEST",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND",
            INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
        }
    },
    POST: {
        NAME: "POST",
        RESPONSE: {
            SUCCESS: "SUCCESS",
            SUCCESS_CREATED: "SUCCESS_CREATED",
            SUCCESS_NO_CONTENT: "SUCCESS_NO_CONTENT",
            SUCCESS_FUNCTIONAL_ERROR: "SUCCESS_FUNCTIONAL_ERROR",
            BAD_REQUEST: "BAD_REQUEST",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND",
            CONFLICT: "CONFLICT",
            INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
        }
    },
    PUT: {
        NAME: "PUT",
        RESPONSE: {
            SUCCESS: "SUCCESS",
            SUCCESS_NO_CONTENT: "SUCCESS_NO_CONTENT",
            SUCCESS_FUNCTIONAL_ERROR: "SUCCESS_FUNCTIONAL_ERROR",
            BAD_REQUEST: "BAD_REQUEST",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND",
            CONFLICT: "CONFLICT",
            INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
        }
    },
    PATCH: {
        NAME: "PATCH",
        RESPONSE: {
            SUCCESS: "SUCCESS",
            SUCCESS_NO_CONTENT: "SUCCESS_NO_CONTENT",
            SUCCESS_FUNCTIONAL_ERROR: "SUCCESS_FUNCTIONAL_ERROR",
            BAD_REQUEST: "BAD_REQUEST",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND",
            CONFLICT: "CONFLICT",
            INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
        }
    },
    DELETE: {
        NAME: "DELETE",
        RESPONSE: {
            SUCCESS: "SUCCESS",
            SUCCESS_NO_CONTENT: "SUCCESS_NO_CONTENT",
            SUCCESS_FUNCTIONAL_ERROR: "SUCCESS_FUNCTIONAL_ERROR",
            BAD_REQUEST: "BAD_REQUEST",
            FORBIDDEN: "FORBIDDEN",
            NOT_FOUND: "NOT_FOUND",
            CONFLICT: "CONFLICT",
            INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"
        }
    }
};


// Configuration
var METHOD; // String
var RESPONSE; // Object


/** Defines what the module api-helper exports.
 * 
 * @param {String} method - Method that will be used. Accepted values:
 * "GET"|"POST"|"PUT"|"PATCH"|"DELETE"
 * 
 * TODO add @returns
 * 
 * TODO add @throws
*/
module.exports = function (method) {
    var module = {};
    
    // Module initialization
    if(!methodIsValid(method)) {
        throw new Error("Module parameter 'AWS Region' missing");
    } else {
        METHOD = method;
    }
    
    // API Helper constants
    RESPONSE = SUPPORTED_METHOD[METHOD].RESPONSE;
    module.RESPONSE = RESPONSE;
    
    // API Helper methods
    module.buildResponse = buildApiResponse;
    
    return module;
};



// -------------------- Module Methods --------------------

/** Returns the response expected by API Gateway based on the response type. The
 * response is returned as an object with two attributes: error and success.
 * These should be sent as the first and second input on the Lambda's callback,
 * respectively.
 * 
 * @param {String} type - Type of response, according to the (internally
 * defined) global definition RESPONSE.
 * @param {Object} context - Lambda's context.
 * @param {String} context.awsRequestId - unique identifier of the current
 * request.
 * @param {Object} [resource] - Contains a resource to be included in
 * the response as its body; only used for response type RESPONSE.SUCCESS.
 * 
*/
function buildApiResponse(type, context, resource) {

    var response = {
        error: undefined,
        success: undefined
    };

    switch (METHOD) {
        case SUPPORTED_METHOD.GET.NAME:
            response = buildGetResponse(type, context, resource);
            break;
        
        case SUPPORTED_METHOD.POST.NAME:
            response = buildPostResponse(type, context, resource);
            break;
        
        case SUPPORTED_METHOD.PUT.NAME:
            response = buildPutResponse(type, context, resource);
            break;
        
        case SUPPORTED_METHOD.PATCH.NAME:
            response = buildPatchResponse(type, context, resource);
            break;
        
        case SUPPORTED_METHOD.DELETE.NAME:
            response = buildDeleteResponse(type, context, resource);
            break;
        
        default:
            throw new Error("Unsupported method: " + METHOD);
    }

    return response;
}



// -------------------- Other Methods --------------------

/** Returns true if method has a valid value.
 * 
 * @param {String} method - Method that will be used. Accepted values:
 * "GET"|"POST"|"PUT"|"PATCH"|"DELETE"
*/
function methodIsValid(method) {
    if(!method) return false;
    if(!SUPPORTED_METHOD[method]) return false;
    
    return true;
}


function buildGetResponse(type, context, resource) {

    var response = {
        error: undefined,
        success: undefined
    };
    
    switch (type) {
        case RESPONSE.SUCCESS:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
            
        case RESPONSE.SUCCESS_FUNCTIONAL_ERROR:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                const { type, code, message, emcpRequestId } = resource;
                response.success.body = {
                    error: {
                        type, 
                        code, 
                        message, 
                        emcpRequestId
                    }
                };
            }
            break;

        case RESPONSE.BAD_REQUEST:
            response.error = {};
            response.error.statusCode = 400;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.FORBIDDEN:
            response.error = {};
            response.error.statusCode = 403;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.NOT_FOUND:
            response.error = {};
            response.error.statusCode = 404;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.INTERNAL_SERVER_ERROR:
            response.error = {};
            response.error.statusCode = 500;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;

        default:
            throw new Error("Not Implemented. Unsupported response type");
    }

    // You must turn the error object into a JSON string before calling callback
    // to exit the Lambda function. Otherwise, the error object is returned as
    // a string with content "[object Object]"
    if(response.error) {
        response.error = JSON.stringify(response.error);
    }

    return response;
}


function buildPostResponse(type, context, resource) {
    
    var response = {
        error: undefined,
        success: undefined
    };
    
    switch (type) {
        case RESPONSE.SUCCESS:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
        
        case RESPONSE.SUCCESS_CREATED:
            response.success = {};
            response.success.statusCode = 201;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
        
        case RESPONSE.SUCCESS_NO_CONTENT:
            response.success = {};
            response.success.statusCode = 204;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;

        case RESPONSE.SUCCESS_FUNCTIONAL_ERROR:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                const { type, code, message, emcpRequestId } = resource;
                response.success.body = {
                    error: {
                        type, 
                        code, 
                        message, 
                        emcpRequestId
                    }
                };
            }
            break;
        
        case RESPONSE.BAD_REQUEST:
            response.error = {};
            response.error.statusCode = 400;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.FORBIDDEN:
            response.error = {};
            response.error.statusCode = 403;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        case RESPONSE.NOT_FOUND:
            response.error = {};
            response.error.statusCode = 404;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.CONFLICT:
            response.error = {};
            response.error.statusCode = 409;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.INTERNAL_SERVER_ERROR:
            response.error = {};
            response.error.statusCode = 500;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        default:
            throw new Error("Not Implemented. Unsupported response type");
    }
    
    // You must turn the error object into a JSON string before calling callback
    // to exit the Lambda function. Otherwise, the error object is returned as
    // a string with content "[object Object]"
    if(response.error) {
        response.error = JSON.stringify(response.error);
    }
    
    return response;
}


function buildPutResponse(type, context, resource) {
    
    var response = {
        error: undefined,
        success: undefined
    };
    
    switch (type) {
        case RESPONSE.SUCCESS:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
        
        case RESPONSE.SUCCESS_NO_CONTENT:
            response.success = {};
            response.success.statusCode = 204;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;

        case RESPONSE.SUCCESS_FUNCTIONAL_ERROR:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                const { type, code, message, emcpRequestId } = resource;
                response.success.body = {
                    error: {
                        type, 
                        code, 
                        message, 
                        emcpRequestId
                    }
                };
            }
            break;
        
        case RESPONSE.BAD_REQUEST:
            response.error = {};
            response.error.statusCode = 400;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.FORBIDDEN:
            response.error = {};
            response.error.statusCode = 403;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        case RESPONSE.NOT_FOUND:
            response.error = {};
            response.error.statusCode = 404;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.CONFLICT:
            response.error = {};
            response.error.statusCode = 409;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.INTERNAL_SERVER_ERROR:
            response.error = {};
            response.error.statusCode = 500;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        default:
            throw new Error("Not Implemented. Unsupported response type");
    }
    
    // You must turn the error object into a JSON string before calling callback
    // to exit the Lambda function. Otherwise, the error object is returned as
    // a string with content "[object Object]"
    if(response.error) {
        response.error = JSON.stringify(response.error);
    }
    
    return response;
}


function buildPatchResponse(type, context, resource) {
    
    var response = {
        error: undefined,
        success: undefined
    };
    
    switch (type) {
        case RESPONSE.SUCCESS:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
        
        case RESPONSE.SUCCESS_NO_CONTENT:
            response.success = {};
            response.success.statusCode = 204;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;

        case RESPONSE.SUCCESS_FUNCTIONAL_ERROR:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                const { type, code, message, emcpRequestId } = resource;
                response.success.body = {
                    error: {
                        type, 
                        code, 
                        message, 
                        emcpRequestId
                    }
                };
            }
            break;
        
        case RESPONSE.BAD_REQUEST:
            response.error = {};
            response.error.statusCode = 400;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.FORBIDDEN:
            response.error = {};
            response.error.statusCode = 403;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        case RESPONSE.NOT_FOUND:
            response.error = {};
            response.error.statusCode = 404;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.CONFLICT:
            response.error = {};
            response.error.statusCode = 409;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.INTERNAL_SERVER_ERROR:
            response.error = {};
            response.error.statusCode = 500;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        default:
            throw new Error("Not Implemented. Unsupported response type");
    }
    
    // You must turn the error object into a JSON string before calling callback
    // to exit the Lambda function. Otherwise, the error object is returned as
    // a string with content "[object Object]"
    if(response.error) {
        response.error = JSON.stringify(response.error);
    }
    
    return response;
}


function buildDeleteResponse(type, context, resource) {
    
    var response = {
        error: undefined,
        success: undefined
    };
    
    switch (type) {
        case RESPONSE.SUCCESS:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;
        
        case RESPONSE.SUCCESS_NO_CONTENT:
            response.success = {};
            response.success.statusCode = 204;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.success.body = resource;
            }
            break;

        case RESPONSE.SUCCESS_FUNCTIONAL_ERROR:
            response.success = {};
            response.success.statusCode = 200;
            response.success.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                const { type, code, message, emcpRequestId } = resource;
                response.success.body = {
                    error: {
                        type, 
                        code, 
                        message, 
                        emcpRequestId
                    }
                };
            }
            break;
        
        case RESPONSE.BAD_REQUEST:
            response.error = {};
            response.error.statusCode = 400;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.FORBIDDEN:
            response.error = {};
            response.error.statusCode = 403;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        case RESPONSE.NOT_FOUND:
            response.error = {};
            response.error.statusCode = 404;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;

        case RESPONSE.CONFLICT:
            response.error = {};
            response.error.statusCode = 409;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
            
        case RESPONSE.INTERNAL_SERVER_ERROR:
            response.error = {};
            response.error.statusCode = 500;
            response.error.headers = {
                "XRequestID": context.awsRequestId
            };
            if(resource) {
                response.error.body = resource;
            }
            break;
        
        default:
            throw new Error("Not Implemented. Unsupported response type");
    }
    
    // You must turn the error object into a JSON string before calling callback
    // to exit the Lambda function. Otherwise, the error object is returned as
    // a string with content "[object Object]"
    if(response.error) {
        response.error = JSON.stringify(response.error);
    }
    
    return response;
}

