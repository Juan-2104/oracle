const dotenv = require('dotenv');
const logger = require('../utils/bei-logger')
dotenv.config();
const { PostConfig, GetListConfig, PutConfig, DeleteConfig, GetMetadata, PostMetadata, PutMetadata, DeleteMetadata, GetBEIVersion } = require("../controllers/config/configs");
const { PostAes256Crypto, PostAes256DeCrypto, PostHashMD5, PostHashSha256 } = require("../controllers/config/data-hashinhg");
const HealthCheck = require("../controllers/config/healthcheck-controller");
const { PostConfigSchema, PutConfigSchema, DeleteConfigSchema, GetListConfigSchema, GetMetadataSchema, PostMetaDataSchema, PutMetaDataSchema, DeleteMetadataSchema, GetBEIVersionSchema } = require("../schemas/config-schema");
const { GetHealthSchema, PostAES256CrytoSchema, PostAES256DeCrytoSchema, PostHashMD5Schema, PostHasSHA56Schema } = require("../schemas/data-hashing-schema");

// Configuración de las rutas de configuración del BEI
module.exports = async function (fastify, options, done) {
    fastify.get('/health', GetHealthSchema, HealthCheck);
    fastify.post('/sync/encrypt', PostAES256CrytoSchema, PostAes256Crypto);
    fastify.post('/sync/decrypt', PostAES256DeCrytoSchema, PostAes256DeCrypto);
    fastify.post('/checksum/md5', PostHashMD5Schema, PostHashMD5);
    fastify.post('/checksum/sha256', PostHasSHA56Schema, PostHashSha256);
    // Servicios de configuración del BEI
    fastify.post('/config', PostConfigSchema, PostConfig);
    fastify.get('/config', GetListConfigSchema, GetListConfig);
    // Servicios de gestión de la metadata del componente.
    fastify.get('/metadata',GetMetadataSchema,GetMetadata)
    fastify.post('/metadata',PostMetaDataSchema,PostMetadata)
    fastify.get('/beiversion', GetBEIVersionSchema, GetBEIVersion)
    done();
}