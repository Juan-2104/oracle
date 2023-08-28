const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const oracledb = require('oracledb');
const {ValidaAPIKey, NotAuthorizedError} = require('../../utils/secutils');

function GetFields(fields){
    return fields?fields:'*'
}

function GetFilter(filter) {
    return filter?`where ${filter}`:''
}

module.exports =  async function GetWithParamsHandler(req, reply) {
    try {
        await ValidaAPIKey(req)
        logger.debug(`Entrando al GET de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        logger.debug(`ID Solicitado: ${req.params[req.routeConfig.identifier]}`)
        const dbclient = await oracledb.getConnection();
        // req.query.filter = `${beiConfigs.identifier} = '${req.params._id}'`
        let consulta = `select ${GetFields(req.query.fields)} from "${req.routeConfig.dbschema}"."${req.routeConfig.table}"  where "${req.routeConfig.identifier}" = :filterValue`
        let filterValue = req.params[req.routeConfig.identifier]
        logger.debug(`Consulta de insercion ${consulta}`)
        let results = await  dbclient.execute(consulta, [filterValue])
        logger.debug(`Ejecución de la consulta, EXITOSA. Filas obtenidas: ${results.rows.length}`)
        dbclient.release()
        // Para llenar los nombres de los campos de la tabla
        const columnNames = results.metaData.map(column => column.name);
        let output = [];
        for (const row of results.rows) {
            const rowData = {};
            columnNames.forEach((colName, index) => {
              rowData[colName] = row[index];
            });
            output.push(rowData);
          }
        reply.code(results.rows.length>0?200:404)
        reply.send(output[0])
    } catch (error) {
        logger.error(`GetHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(error.status?error.status:500)
        reply.send({
            errorMessage: error.message
        })
    }
}
