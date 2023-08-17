const logger = require('./bei-logger');

function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }
    return !!(typeof item === "object" && item !== null);
}

function serializeValues(req){
    let values = []
    Object.values(req.body).forEach(value => {
        logger.debug(`Es JSON? ${isJson(value)}`)
        values.push(isJson(value)?JSON.stringify(value):value)
    }) 
    return values
}

function serializeValue(value){
    return isJson(value)?JSON.stringify(value):value
}


module.exports = {
    isJson,
    serializeValues,
    serializeValue
}