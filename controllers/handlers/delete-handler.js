const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');

function GetFilter(filter) {
    return filter?`where ${filter}`:''
}

module.exports =  async function DeleteHandler(req, reply) {
    try {
        logger.debug(`Entrando al GET de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await pool.connect()
        const request = new Request(dbclient);
        let consulta = `DELETE from ${req.routeConfig.table}  where ${req.routeConfig.identifier} = @${req.routeConfig.identifier}`
        request.input(req.routeConfig.identifier,req.params[req.routeConfig.identifier])
        // req.query.filter = `${beiConfigs.identifier} = '${req.params._id}'`
        let results = await request.query(consulta)
        logger.debug(`Ejecución de la consulta, EXITOSA. Filas ELIMINADAS:  ${results.rowsAffected.length}`)
        dbclient.release()
        reply.code(200)
        reply.send({status: 'OK', action: 'delete',eliminated_rows:  results.rowsAffected.length})
    } catch (error) {
        logger.error(`GetHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(500)
        reply.send({
            errorMessage: error.message
        })
    }
}
