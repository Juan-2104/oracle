const GetHealthSchema = {
    schema: {
        description: 'Servicio de verificación de estado del componente de integración',
        tags: ['BEI-Utils'],
        
    }
}

const BodyCryptoSchema = {
    type: 'object',
    properties: {
        phrase: { type: 'string' },
        key: { type: 'string' }
    },
    required: [
        'phrase'
    ]
}

const BodyHashSchema = {
    type: 'object',
    properties: {
        phrase: { type: 'string' }
    },
    required: [
        'phrase'
    ]
}

const PostAES256CrytoSchema= {
    schema: {
        description: 'Utileria para encriptar en AES256 cadenas de texto.',
        tags: ['BEI-Utils'],
        body: BodyCryptoSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string'}
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

const PostAES256DeCrytoSchema= {
    schema: {
        description: 'Utileria para desencriptar en AES256 cadenas de texto.',
        tags: ['BEI-Utils'],
        body: BodyCryptoSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string'}
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

const PostHashMD5Schema= {
    schema: {
        description: 'Utileria para generar hashes MD5 con cadenas de texto.',
        tags: ['BEI-Utils'],
        body: BodyHashSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string'}
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

const PostHasSHA56Schema= {
    schema: {
        description: 'Utileria para generar hashes SHA256  con cadenas de texto.',
        tags: ['BEI-Utils'],
        body: BodyHashSchema,
        headers: {
            type: 'object',
            properties: {
                apiKey: { type: 'string'}
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
    GetHealthSchema,
    PostAES256CrytoSchema,
    PostAES256DeCrytoSchema,
    PostHashMD5Schema,
    PostHasSHA56Schema
}