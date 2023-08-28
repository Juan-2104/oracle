const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const oracledb = require('oracledb');
const {ValidaAPIKey, NotAuthorizedError} = require('../../utils/secutils');

function GetFilter(filter) {
    return filter?`where ${filter}`:''
}

module.exports =  async function DeleteHandler(req, reply) {
    try {
        await ValidaAPIKey(req)
        logger.debug(`Entrando al GET de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await oracledb.getConnection();
        let values = [];
        let consulta = `DELETE from "${req.routeConfig.dbschema}"."${req.routeConfig.table}"  where ${req.routeConfig.identifier} = :filterValue`
        let filterValue = req.params[req.routeConfig.identifier]
        values.push(filterValue)
        // request.input(req.routeConfig.identifier,req.params[req.routeConfig.identifier])
        // req.query.filter = `${beiConfigs.identifier} = '${req.params._id}'`
        let results = await dbclient.execute(consulta, values)
        logger.debug(`Ejecución de la consulta, EXITOSA. Filas ELIMINADAS:  ${results.rowsAffected}`)
        await dbclient.commit();
        dbclient.release()
        reply.code(200)
        reply.send({status: 'OK', action: 'delete',eliminated_rows:  results.rowsAffected})
    } catch (error) {
        logger.error(`GetHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(error.status?error.status:500)
        reply.send({
            errorMessage: error.message
        })
    }
}
