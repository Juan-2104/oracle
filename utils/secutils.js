const dotenv = require('dotenv');

dotenv.config();

class NotAuthorizedError extends Error {
    constructor(message) {
        super(message)
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name
        this.status = 403
    }
    statusCode() {
        return this.status
    }
}

async function ValidaAPIKey(req) {
    if (req.headers.apikey !== process.env.APIKEY)
        throw new NotAuthorizedError('You need a valid APIKEY')
}

module.exports ={
    NotAuthorizedError,
    ValidaAPIKey
}