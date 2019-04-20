const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '../env/.env') })

const requiredEnvVars = [ 'NODE_ENV' ]
if (process.env.NODE_ENV == 'development') requiredEnvVars.push('FRONTEND_URL')
const { checkEnvVars } = require('../scripts/utils')
checkEnvVars( requiredEnvVars )

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production'
