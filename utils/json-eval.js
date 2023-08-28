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

function isDateFormat(str) {
    // Regular expressions for common date formats
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      /^\d{4}-\d{2}-\d{2}(T|\s)\d{2}\:\d{2}\:\d{2}.*/ // YYYY-MM-DDTHH:MM:SS
    ];
  
    return dateFormats.some(regex => regex.test(str));
  }

function serializeValue(value){
    return isJson(value)?JSON.stringify(value):(isDateFormat(value)?new Date(value):value)
}


module.exports = {
    isJson,
    serializeValues,
    serializeValue
}