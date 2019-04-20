const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const logger = require('morgan')

require('./config')

const routes = require('./routes')

const app = express()

require('./socketio')(app)

app.use(helmet())
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.use(routes)

if (process.env.NODE_ENV == 'development') {
  const proxy = require('http-proxy-middleware')
  app.use(proxy({
    target: process.env.FRONTEND_URL,
    changeOrigin: true,
  }))
} else {
  const fs = require('fs')
  const prpl = require('prpl-server')
  const polymerJson = fs.readFileSync('./build/polymer.json', 'utf8')
  app.get('/*', prpl.makeHandler('./build/', JSON.parse(polymerJson)))
}

app.use((req, res, next) => res.status(404).send())

module.exports = app
