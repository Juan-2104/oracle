const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración de la conexion de POSTGRES
const oracledb = require('oracledb');
const { DecryptData } = require('../../utils/crypto-utils');
const connetionString = `${beiConfigs.host}:${beiConfigs.port}/${beiConfigs.database}`
// Configuración del pool de conexiones.
module.exports = oracledb.getConnection({
    user: beiConfigs.user,
    password: DecryptData( beiConfigs.password, beiConfigs.securedKey),
    connectionString: connetionString
});