/**
 * Created by dragos on 08/06/2017.
 */

"use strict";

/**
 * This is the custom error handling middleware
 * @returns {Function}
 */

module.exports = function () {
    return function *(next){
        try{
            yield next;
        }
        catch(e){
            const resError = {
                code: 500,
                success: false,
                message: e.message,
                errors: e.errors
            };
            if (e instanceof Error) {
                Object.assign(resError, {stack: e.stack});
            }
            Object.assign(this, {body: resError, status: e.status || 500});
        }
    }
};