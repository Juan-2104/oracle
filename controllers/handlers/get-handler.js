const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const OracleDB = require('oracledb');

function GetFields(fields){
    return fields?fields:'*'
}

/**
 * Funcion para obtener el filtro (si es que esta declarado) para agregarlo a la consulta
 * @param {*} filter 
 */
function GetFilter(filter) {
    return filter?`where ${filter}`:''
}

module.exports = async function GetHandler(req, reply) {
    try {
        logger.debug(`Entrando al GET de la tabla ${JSON.stringify(req.routeConfig.table)}`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await pool.getConnection();
        let results = await dbclient.execute(`select ${GetFields(req.query.fields)} from ${req.routeConfig.table} ${GetFilter(req.query.filter)}`)
        logger.debug(`Ejecución de la consulta, EXITOSA. Filas obtenidas: ${results.rowsAffected.length}`)
        dbclient.release()
        reply.code(200)
        reply.send(results.recordset)
    } catch (error) {
        logger.error(`GetHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}
