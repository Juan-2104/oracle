const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const oracledb = require('oracledb');
const {ValidaAPIKey, NotAuthorizedError} = require('../../utils/secutils');

const { serializeValues, serializeValue } = require('../../utils/json-eval');


function GetFields(row) {
    let pairs = Object.keys(row).map( (key, idx) => {
        return  `${key} = :${key}`
    })
    return pairs.join(', ')
}

function GetFilter(filter) {
    return filter?`where ${filter}`:''
}

module.exports =  async function PutHandler(req, reply) {
    try {
        await ValidaAPIKey(req)
        logger.debug(`Entrando al PUT de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await oracledb.getConnection();
        // req.query.filter = `${beiConfigs.identifier} = '${req.params._id}'`
        let consulta = `UPDATE ${req.routeConfig.table} SET ${GetFields(req.body)} where ${req.routeConfig.identifier} = :filterValue`
        logger.debug(`Consulta de insercion ${consulta}`)
        let values = [];
        await Object.keys(req.body).forEach(key => {
            values.push(serializeValue(req.body[key]))
        });
        let filterValue = req.params[req.routeConfig.identifier]
        values.push(filterValue)
        let result = await dbclient.execute(consulta, values)
        await dbclient.commit();
        dbclient.release()
        reply.code(200)
        reply.send({status: 'OK', action: 'update'})
    } catch (error) {
        logger.error(`PostHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(error.status?error.status:500)
        reply.send({
            errorMessage: error.message
        })
    }
}
