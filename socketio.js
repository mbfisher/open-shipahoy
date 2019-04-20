const mqtt = require('mqtt')
const socketio = require('socket.io')

const topic = 'Hamburg all vessels positions'

const client = mqtt.connect(process.env.MESSAGE_BROKER_URL, {
  username: process.env.MESSAGE_BROKER_USERNAME,
  password: process.env.MESSAGE_BROKER_PASSWORD
})

client.on('connect', () => {
  client.subscribe(topic)
  console.log('mqtt client connected and subscribed to topic', topic)
})

module.exports = app => {

  app.socketio = socketio()

  app.socketio.on('connection', socket => {
    console.log('user connected via socket.io')

    client.on('error', err => {
      console.log(`mqtt error: ${err}`)
      socket.emit('error', err)
    })

    client.on('offline', () => {
      console.log('mqtt offline')
      socket.emit('error', 'offline')
    })

    client.on('message', (topic, messageObj) => {
      const messageString = messageObj.toString()
      if (!messageString) return
      const message = JSON.parse(messageString)
      socket.emit('message', message)
    })

  })
}

