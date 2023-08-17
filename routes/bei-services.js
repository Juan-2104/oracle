const dotenv = require('dotenv');
const fs = require('fs')
const deleteHandler = require('../controllers/handlers/delete-handler');
const getHandler = require('../controllers/handlers/get-handler');
const getWithParam = require('../controllers/handlers/get-with-param');
const postHandler = require('../controllers/handlers/post-handler');
const putHandler = require('../controllers/handlers/put-handler');
const logger = require('../utils/bei-logger')
dotenv.config();

function SelectHandler(method) {
    switch (method) {
        case 'get':
            return getHandler;
        case 'getid':
            return getWithParam;
        case 'post':
            return postHandler;
        case 'put':
            return putHandler;
        case 'delete':
            return deleteHandler
        default:
            return null
    }
}

function UsesID(method, identifier) {
    if (method === 'getid' || method === 'put' || method === 'delete') {
        return `/:${identifier}`
    } else {
        return ""
    }
}

function GetMethod(method) {
    if (method === 'getid') {
        return 'GET'
    } else {
        return method.toUpperCase()
    }
}

module.exports = async function (fastify, options, done) {
    try {
        let prefix_url = process.env.API_PREFIX || '/bei-default'
        logger.debug(`El prefijo cargado ${prefix_url}`)
        let data = fs.readFileSync('data/config.json', 'utf-8')
        let metadata = await JSON.parse(data)
        logger.debug(`Metadata ${JSON.stringify(metadata)}`)
        let tables = metadata.tables;
        tables.forEach(table => {
            let methods = Object.keys(table.methods)
            logger.debug(`Metodos cargados: ${methods}`)
            methods.forEach((method) => {
                let url = `/${metadata.database}/${table.name}${UsesID(method,table.identifier)}`
                let route = {
                    url,
                    method: GetMethod(method),
                    schema: table.methods[method],
                    handler: SelectHandler(method),
                    config: { 
                        table: table.name, 
                        identifier: table.identifier 
                    }
                }
                fastify.route(route)
            })
        })

    } catch (error) {
        logger.error(`There was an error on loading routes: ${error.message}`)
    }
    done()
}