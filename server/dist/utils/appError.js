// src/utils/appError.ts
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message); // call parent constructor (Error)
        this.statusCode = statusCode;
        this.isOperational = true; // marks known errors (vs programming bugs)
        // ensures correct stack trace in Node.js
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
//# sourceMappingURL=appError.js.map