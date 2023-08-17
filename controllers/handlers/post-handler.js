const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const { isJson, serializeValues, serializeValue } = require('../../utils/json-eval');

function GetFields(row) {
    return Object.keys(row).join(', ')
}

function GetParams(row) {
    let values = Object.keys(row)
    let strList = []
    for (let i = 0; i < values.length; i++) {
        strList.push(`@${values[i]}`)
    }
    return strList.join(', ')
}

module.exports = async function PostHandler(req, reply) {
    try {
        logger.debug(`Entrando al POST de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await pool.connect()
        let consulta = `INSERT INTO ${req.routeConfig.table} (${GetFields(req.body)}) VALUES (${GetParams(req.body)})`
        const request = new Request(dbclient);
        await Object.keys(req.body).forEach(key => {
            request.input(key, serializeValue(req.body[key]))
        });
        logger.debug(`Consulta de insercion ${consulta}`)
        // let result = await dbclient.query({text: consulta, values: values})
        let result = await request.query(consulta);
        dbclient.release()
        reply.code(200)
        reply.send({status: 'OK', action: 'insert'})
    } catch (error) {
        logger.error(`PostHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }

}
