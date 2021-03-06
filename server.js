const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const mongoose = require('mongoose')
const upload = require('express-fileupload')
const app = express()
app.use(helmet())
app.use(upload())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/FinalYearProject')
require('./controller')(app)

app.listen(5000, () => console.log('running'))