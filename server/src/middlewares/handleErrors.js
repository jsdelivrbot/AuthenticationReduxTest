/**
 * Created by dragos on 06/06/2017.
 */

/**
 * This is the custom error handling middleware
 * @returns {Function}
 */

module.exports = function () {
    return async (ctx, next) => {
        try {
            await next();
        }
        catch (e) {
            const resError = {
                code: 500,
                success: false,
                message: e.message,
                errors: e.errors
            };
            if (e instanceof Error) {
                Object.assign(resError, {stack: e.stack});
            }
            Object.assign(ctx, {body: resError, status: e.status || 500});
        }
    }
};