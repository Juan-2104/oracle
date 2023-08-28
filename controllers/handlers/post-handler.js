const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración del pool de conexiones.
const pool = require('./connection-pool');
const oracledb = require('oracledb');
const {ValidaAPIKey, NotAuthorizedError} = require('../../utils/secutils');
const { isJson, serializeValues, serializeValue } = require('../../utils/json-eval');

function GetFields(row) {
    return Object.keys(row).join(', ')
}

function GetParams(row) {
    let values = Object.keys(row)
    let strList = []
    for (let i = 0; i < values.length; i++) {
        strList.push(`:${values[i]}`)
    }
    return strList.join(', ')
}

function isDateFormat(str) {
    // Regular expressions for common date formats
    const dateFormats = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/ // DD-MM-YYYY
    ];
  
    return dateFormats.some(regex => regex.test(str));
  }

module.exports = async function PostHandler(req, reply) {
    try {
        await ValidaAPIKey(req)
        logger.debug(`Entrando al POST de la tabla`)
        logger.debug(`Conectando a la base de datos`)
        const dbclient = await oracledb.getConnection();
        let consulta = `INSERT INTO "${req.routeConfig.dbschema}"."${req.routeConfig.table}" (${GetFields(req.body)}) VALUES (${GetParams(req.body)})`
        let values = [];
        await Object.keys(req.body).forEach(key => {
            values.push(serializeValue(req.body[key]))
        });
        logger.debug(`Consulta de insercion ${consulta}`)
        // let result = await dbclient.query({text: consulta, values: values})
        let result = await dbclient.execute(consulta, values );
        await dbclient.commit();
        dbclient.release()
        reply.code(200)
        reply.send({status: 'OK', action: 'insert', result})
    } catch (error) {
        logger.error(`PostHandler::Ocurrio un error al intentar la operación:: ${error.message}`)
        reply.code(error.status?error.status:500)
        reply.send({
            errorMessage: error.message
        })
    }

}
