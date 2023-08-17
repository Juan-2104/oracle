const crypto = require('crypto');
const { EncryptData, DecryptData } = require('../../utils/crypto-utils');

async function PostAes256Crypto(req, reply) {
    try {
        const phrase = req.body.phrase;
        const key = req.body.key||process.env.SERIAL;
        let output = EncryptData(phrase, key)
        reply.code(200);
        reply.send({
            output
        })
    }catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

async function PostAes256DeCrypto(req, reply) {
    try {
        const phrase = req.body.phrase;
        const key = req.body.key||process.env.SERIAL;
        let output = DecryptData(phrase, key)
        reply.code(200);
        reply.send({
            output
        })
    }catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

async function PostHashMD5(req,reply){
    try {
        const phrase = req.body.phrase;
        let output = crypto.createHash('md5').update(phrase).digest('hex');
        reply.code(200);
        reply.send({
            output
        })
    }catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

async function PostHashSha256(req,reply){
    try {
        const phrase = req.body.phrase;
        let output = crypto.createHash('sha256').update(phrase).digest('hex');
        reply.code(200);
        reply.send({
            output
        })
    }catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

module.exports = {
    PostAes256Crypto,
    PostAes256DeCrypto,
    PostHashMD5,
    PostHashSha256
}