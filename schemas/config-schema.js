const dotenv = require('dotenv');
const logger = require('../utils/bei-logger')
dotenv.config();

const FieldConfSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        is_auto: { type: 'integer', default: 0 },
        is_key: { type: 'integer', default: 0 },
        is_viewable: { type: 'integer', default: 1 },
        table_id: { type: 'string' }
    },
    required: [
        'name',
        'is_auto',
        'is_key',
    ]
}

const MetaDataSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', },
        name: { type: 'string' },
        description: { type: 'string' },
        xposer_server: { type: 'string' },
        serial_number: { type: 'string' },
    },
    required: [
        'name',
        'xposer_server'
    ]
}

const GetMetadataSchema = {
    schema: {
        description: 'Creación de metadata para el BEI',
        tags: ['BEI-Configuration'],
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

const DeleteMetadataSchema = {
    schema: {
        description: 'Creación de metadata para el BEI',
        tags: ['BEI-Configuration'],
        params: {
            type: 'object',
            properties: {
                idconf: { type: 'string' }
            },
            required: [
                'idconf'
            ]
        },
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

const PostMetaDataSchema = {
    schema: {
        description: 'Creación de metadata para el BEI',
        tags: ['BEI-Configuration'],
        body: MetaDataSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

const PutMetaDataSchema = {
    schema: {
        description: 'Actualización de metadata para el BEI',
        tags: ['BEI-Configuration'],
        params: {
            type: 'object',
            properties: {
                idconf: {
                    type: 'string',
                    description: 'ID de configuración'
                }
            }
        },
        body: MetaDataSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

const TableConfSchema = {
    type: 'object',
    properties: {
        identifier: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        methods: {
            type: 'object',
            properties: {
                get: {type: 'object'},
                getid: {type: 'object'},
                post: {type: 'object'},
                put: {type: 'object'},
                delete: {type: 'object'}
            }
        }
        
    },
    required: [
        'name'
    ]
}

const AllConfSchema = {
    type: 'object',
    properties: {
        '_id': {type: 'string'},
        database: { type: 'string' },
        host: { type: 'string' },
        port: { type: 'integer' },
        user: { type: 'string' },
        password: { type: 'string' },
        description: {type: 'string'},
        tables: {
            type: 'array',
            items: TableConfSchema
        }
    }
}



// Esquema para el listado de la configuración del BEI.
const GetListConfigSchema = {
    schema: {
        description: 'Obtener listado de configuraciones para este tipo especifico de integración',
        tags: ['BEI-Configuration'],
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

// Esquema para la construcción de la eliminación de la configuración del BEI.
const DeleteConfigSchema = {
    schema: {
        description: 'Eliminación de una configuración específica para este tipo especifico de integración',
        tags: ['BEI-Configuration'],
        params: {
            type: 'object',
            properties: {
                idconf: { type: 'string' }
            },
            required: [
                'idconf'
            ]
        },
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

// Esquema para la construcción de la creación de la configuración del BEI.
const PostConfigSchema = {
    schema: {
        description: 'Creación de objetos de configuración para este tipo específico de integración',
        tags: ['BEI-Configuration'],
        body: AllConfSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }
}

// Esquema para la construcción de la actualización de la configuración del BEI.
const PutConfigSchema = {
    schema: {
        description: 'Actualización de objetos de configuración para este tipo específico de integración',
        tags: ['BEI-Configuration'],
        params: {
            type: 'object',
            properties: {
                idconf: {
                    type: 'string',
                    description: 'ID de configuración'
                }
            }
        },
        body: TableConfSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string' }
            },
            required: [
                'apiKey'
            ]
        },
        security: [
            {
                "apiKey": [process.env.APIKEY]
            }
        ]
    }

}

module.exports = {
    GetListConfigSchema,
    PostConfigSchema,
    PutConfigSchema,
    DeleteConfigSchema,
    GetMetadataSchema,
    PostMetaDataSchema,
    PutMetaDataSchema,
    DeleteMetadataSchema,
}