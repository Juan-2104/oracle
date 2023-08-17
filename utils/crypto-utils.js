var crypto = require('crypto')
const logger = require('./bei-logger')

function EncryptData(text, key) {
    const derivedKey = crypto.createHash('sha256').update(key).digest();
    let iv = crypto.createHash('md5').update(key).digest('hex').slice(0,16)
    logger.debug(`IV calculado: ${iv}`)
    const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
    let salida = cipher.update(text, 'utf-8', 'base64')
    salida += cipher.final('base64')
    return salida
}

function DecryptData(text, key) {
    const derivedKey = crypto.createHash('sha256').update(key).digest();
    let iv = crypto.createHash('md5').update(key).digest('hex').slice(0,16)
    logger.debug(`IV calculado: ${iv}`)
    const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);
    let salida = decipher.update(text, 'base64', 'utf-8')
    salida += decipher.final('utf-8')
    return salida
}

module.exports = {
    EncryptData,
    DecryptData
}