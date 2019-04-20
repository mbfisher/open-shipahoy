const express = require('express')
const request = require('request-promise-native')
const { checkEnvVars } = require('../scripts/utils.js')
checkEnvVars([ 'API_URL' ])

const router = express.Router()

function simulatorProxy(req) {
  const requestOptions = { uri: `${process.env.API_URL}${req.url}` }
  return new Promise(async (resolve, reject) => {
    try {
      const response = await request(requestOptions)
      resolve(response)
    } catch(error) {
      console.error(error)
      reject(error)
    }
  })
}

router.get('/api/v1/hamburg/vessels', async (req, res, next) => {
  try {
    const result = await simulatorProxy(req)
    return res.status(200).send(result)
  } catch(error) {
    return next(error)
  }
})

module.exports = router
