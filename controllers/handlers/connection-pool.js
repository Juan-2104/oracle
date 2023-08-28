const dotenv = require('dotenv');
dotenv.config();
const logger = require('../../utils/bei-logger');
const beiConfigs = require('../../data/config.json')
// Configuración de la conexion de POSTGRES
const oracledb = require('oracledb');
const { DecryptData } = require('../../utils/crypto-utils');
const connetionString = `${beiConfigs.host}:${beiConfigs.port}/${beiConfigs.database}`
// Configuración del pool de conexiones.
module.exports = oracledb.createPool({
    user: beiConfigs.user,
    password: DecryptData( beiConfigs.password, beiConfigs.securedKey),
    connectionString: connetionString,
    poolMax: beiConfigs.poolMax?beiConfigs.poolMax:10,
    poolMin: beiConfigs.poolMin?beiConfigs.poolMin:2,
    poolIncrement: beiConfigs.poolIncrement?beiConfigs.poolIncrement:1,
    poolTimeout: beiConfigs.poolTimeout?beiConfigs.poolTimeout:60,
    poolPingInterval: beiConfigs.poolPingInterval?beiConfigs.poolPingInterval:60,
});