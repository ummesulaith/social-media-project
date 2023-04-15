const express = require('express'),
    api = require('./routes/api'),
    app = express(),
    helmet = require('helmet');


app.use(express.json())
app.use(helmet())
app.use('/v1', api);


module.exports = app
