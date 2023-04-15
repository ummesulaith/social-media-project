const express = require('express'),
    // api = require('./routes/api'),
    app = express();


app.use(express.json())
// app.use('/v1', api);


module.exports = app
