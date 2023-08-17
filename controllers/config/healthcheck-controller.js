
async function HealthCheck(req, reply) {
    reply.status(200)
    reply.send({
        message: "OK"
    })
}

module.exports = HealthCheck