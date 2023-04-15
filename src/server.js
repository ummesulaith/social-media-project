const http = require('http')
const app = require('./app')
require('dotenv').config()
const PORT = process.env.PORT || 8000;


const server = http.createServer(app)

function startServer() {
    server.listen(PORT, () => {
        console.log('listening to port', PORT)
    })
}

startServer()