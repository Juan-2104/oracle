const dotenv = require('dotenv');
const logger = require('../../utils/bei-logger')
dotenv.config();
const { v4: uudi4 } = require('uuid')
const sqlite3 = require('sqlite3');
const { EncryptData } = require('../../utils/crypto-utils');

/******************************************************************************
FUNCIONES PARA MANIPULAR CONFIG
******************************************************************************/

/**
 * Funcion para insertar una configuración
 * @param {*} config 
 * @returns 
 */
async function InsertConfig(config) {
    return new Promise(async (resolve, reject) => {
        try {
            let dbconf = new sqlite3.Database('../../data/configs.db',sqlite3.OPEN_READWRITE)
            // Reviso si viene con ID, si no, entonces calculo uno en uuid v4
            config.id = config.id ? config.id : uudi4();
            logger.debug(`ID to insert: ${config.id}`)
            logger.debug(`Encriptando credenciales`)
            config.password = EncryptData(config.password, config.id)
            logger.debug(`Intentando insertar el registro de configuración en la base interna.`)
            dbconf.run ('INSERT INTO table_conf (id, table, database, user, password, host, port, description) values (?,?,?,?,?,?,?,?)',
            [config.id, config.table, config.database, config.user, config.password, config.host, config.port, config.description],
            function(error) {
                if(err){
                    throw new Error(err)
                }
            })
            dbconf.close()
            resolve({ inserted: true , id: config.id, operation: 'InsertConfig'})
        } catch (error) {
            logger.error(`Ocurrio un error al insertar la configuración ${error.message}`)
            reject({ error, inserted: false, operation: 'InsertConfig' })
        }
    })
}

/******************************************************************************
FUNCIONES PARA MANIPULAR METADATA
******************************************************************************/

async function InsertMetadata(metadata) {
    return new Promise (async (resolve, reject) => {
        try {
            let dbconf = new sqlite3.Database('../../data/configs.db',sqlite3.OPEN_READWRITE)
            logger.debug(`Intentando insertar el registro de metadata en la base interna.`)
            dbconf.run ('INSERT INTO metadata (id, name, description, xposer_server, serial_number) values (?,?,?,?,?)', 
            [metadata.id, metadata.name, metadata.description, metadata.xposer_server, metadata.serial_number],
            function(error) {
                if(err){
                    throw new Error(err)
                }
            })
            dbconf.close()
            resolve({ inserted: true , id: metadata.id, operation: 'InsertMetadata'})
        } catch (error) {
            logger.error(`Ocurrio un error al insertar la configuración ${error.message}`)
            reject({ error, inserted: false, operation: 'InsertMetadata' })
        }
    })
}

/******************************************************************************
FUNCIONES PARA MANIPULAR FIELDS
******************************************************************************/
async function InsertField(field, configId) {
    return new Promise (async (resolve, reject) => {
        try {
            let dbconf = new sqlite3.Database('../../data/configs.db',sqlite3.OPEN_READWRITE)
            logger.debug(`Intentando insertar el registro de campos en la base interna.`)
            dbconf.run ('INSERT INTO fields_conf (id, name, description, is_auto, is_key, is_viewable, table_id) values (?,?,?,?,?,?,?)', 
            [field.id?field.id:0, field.name, field.description, field.is_auto, field.is_key, field.is_viewable, configId],
            function(error) {
                if(err){
                    throw new Error(err)
                }
            })
            dbconf.close()
            resolve({ inserted: true , id: field.id, operation: 'InsertField'})
        } catch (error) {
            logger.error(`Ocurrio un error al insertar la configuración ${error.message}`)
            reject({ error, inserted: false, operation: 'InsertField' })
        }
    })
}


module.exports = {
    InsertConfig,
    InsertMetadata,
    InsertField
}