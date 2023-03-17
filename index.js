const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const etudiantRouter = require('./routes/etudiant')
const userRouter = require('./routes/user')
const coursRouter = require('./routes/cours')
const mongoose = require('mongoose')
const { User } = require('./models/User')
const { Etudiant } = require('./models/Etudiant')
const Prof = require('./models/Prof')
app.use(cors())
app.use(express.json())
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', //* ==> all ip adress
    methods: ['GET', 'POST'],
  },
})

app.use('/etudiant', etudiantRouter)
app.use('/user', userRouter)
app.use('/cours', coursRouter)
const port = 5000
mongoose
  .connect('mongodb://127.0.0.1:27017/PFE-Chaima-Dorsaf')
  .then(() => {
    console.log('connected to db')
  })
  .catch((error) => {
    console.log(`Error : ${error.message}`)
  })

io.on('connection', (client) => {
  client.emit('getSocketId', { socketId: client.id })

  client.on('setUser', async (data) => {
    var user
    if (data.userId === null) return
    if (data.role === 'etudiant') {
      user = await Etudiant.findById(data.userId)
    } else {
      user = await Prof.findById(data.userId)
    }

    if (user !== null) {
      user.socketId = data.socketId
      user.save((error, savedUser) => {})
    }
  })

  client.on('send_message', (data) => {
    //enregistrement du message dans la BD
    if (data.idReciever.length === 0) {
      io.emit('message_recieved', {
        message: data.message,
        nomSender: data.nomSender,
        date: new Date(),
        idSender: data.idSender,
      })
    }
  })
})

server.listen(5000, () => {
  console.log('SERVER RUNNING')
})
