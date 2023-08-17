const https = require('https');
const fs = require('fs')
const dotenv = require('dotenv');
const logger = require('./utils/bei-logger')
dotenv.config();

const fastify = require("fastify")({
  logger: false,
  bodyLimit: 2048576,
  https: {
    requestCert: true,
    rejectUnauthorized: false,
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.pem'),
    ca: fs.readFileSync('./certs/rootCA.pem'),
    secureOptions: 'TLS_RSA_WITH_AES_128_CBC_SHA256:TLS_RSA_WITH_AES_256_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384'
  }
});
// Habilito el swagger
fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'G6Flow - BEI',
      decription: 'Backend Integration componentes to allow interaction with DB objetcs',
      version: '1.0.0'
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  }
})

fastify.register(require('@fastify/swagger-ui'), {
  routePrefix: '/bei-admin/v1/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

// Registro de rutas
fastify.register(require('./routes/config'), { prefix: '/bei-admin/v1' })
logger.debug(`Rutas de configuración cargadas`)
fastify.register(require('./routes/bei-services'), {prefix: process.env.API_PREFIX || '/bei-default'})

fastify.listen({ port: process.env.PORT, host: process.env.IP })
logger.info(`Servicio iniciado correctamente en ${process.env.IP}:${process.env.PORT}`)