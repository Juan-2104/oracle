const dotenv = require('dotenv');
const logger = require('../../utils/bei-logger');
const { InsertConfig, InsertField } = require('./confdb-opers');
const fs = require('fs')
const { v4: uuid4 } = require('uuid')
const crypto = require('crypto');
const { EncryptData, DecryptData } = require('../../utils/crypto-utils');
dotenv.config();

/******************************************************************************
FUNCIONES PARA SERVICIOS DE CONFIG
******************************************************************************/
/**
 * Funcion para listar las configuraciones almacenadas en el BEI.
 * @param {*} req 
 * @param {*} reply 
 */
async function GetListConfig(req, reply) {
    try {
        let data = fs.readFileSync('data/config.json', 'utf-8')
        let config = await JSON.parse(data)
        logger.debug(`Esta fue la contraseña encriptada ${config.password}`)
        logger.debug(`Esta fue la contraseña desencriptada ${DecryptData( config.password, config.securedKey)}`)
        reply.code(200)
        reply.send(config)
    } catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

async function PostConfig(req, reply) {
    try {
        let config = req.body
        // Preparación de los campos generados por el BEI
        config._id= config._id?config._id: uuid4()
        config.created = config.created?config.created:new Date().getTime()
        config.modified = config.created?new Date().getTime():null
        config.securedKey = config.securedKey?config.securedKey: crypto.createHash('sha256').update(config._id + '::' + config.created).digest('hex');
        // Encriptación de la data sensible
        config.password = EncryptData(config.password, config.securedKey)
        logger.debug(`Esta fue la contraseña encriptada ${config.password}`)
        logger.debug(`Esta fue la contraseña desencriptada ${DecryptData( config.password, config.securedKey)}`)
        fs.writeFileSync('data/config.json', JSON.stringify(config), { flag: 'w+', encoding: 'utf-8' })
        // Elimino datos sensibles
        delete config.password
        reply.code(200)
        reply.send(
            config
        )
    } catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

/******************************************************************************
FUNCIONES PARA SERVICIOS DE METADATA
******************************************************************************/

async function GetMetadata(req, reply) {
    try {
        let data = fs.readFileSync('data/metadata.json', 'utf-8')
        let metadata = await JSON.parse(data)
        reply.code(200)
        reply.send(metadata)
    } catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

async function PostMetadata(req, reply) {
    try {
        let metadata = req.body
        // Preparación de los campos generados por el BEI
        metadata._id= metadata._id?metadata._id: uuid4()
        metadata.created = metadata.created?metadata.created:new Date().getTime()
        metadata.modified = metadata.created?new Date().getTime():null
        metadata._serial_number= metadata._serial_number?metadata._serial_number: crypto.createHash('md5').update(metadata._id + '::' + metadata.created).digest('hex')
        fs.writeFileSync('data/metadata.json', JSON.stringify(metadata), { flag: 'w+', encoding: 'utf-8' })
        reply.code(200)
        reply.send(
            metadata
        )
    } catch (error) {
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}

module.exports = {
    GetListConfig,
    PostConfig,
    GetMetadata,
    PostMetadata,
}