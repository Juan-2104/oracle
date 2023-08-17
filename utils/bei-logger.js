const dotenv = require('dotenv');
dotenv.config();
const winston = require('winston')
const { combine, timestamp, label, printf, splat, simple } = winston.format;
// Establezco el nivel de logs para la herramienta, desde la variable de entorno o con un default.
const logLevel = (process.env.LOG_LEVEL || 'silly')

const myFormat = printf(({ level, message, label, timestamp, opts }) => {
    return `[${label}] ${level}: ${message}`;
});

// Configuro el logger para poderlo extender a toda la solución.
const Logger = winston.createLogger({
    level: logLevel,
    transports: [
        new winston.transports.Console()
    ],
    format: combine(
        label({ label: process.env.BEI_COMPONENT ||'G6FLOW-BEI-NOTCONFIG' }),
        timestamp(),
        splat(),
        myFormat
    )
})

module.exports = Logger;