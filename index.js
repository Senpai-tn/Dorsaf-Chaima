const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const etudiantRouter = require('./routes/etudiant')
const userRouter = require('./routes/user')
const coursRouter = require('./routes/cours')
const adminRouter = require('./routes/admin')
const quizRouter = require('./routes/quiz')
const messagesRouter = require('./routes/messages')
const mongoose = require('mongoose')
const { User } = require('./models/User')
const { Etudiant } = require('./models/Etudiant')
const Prof = require('./models/Prof')
const path = require('path')
const Admin = require('./models/Admin')
const bcrypt = require('bcrypt')
const Message = require('./models/Message')

require('dotenv').config()
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
app.use('/admin', adminRouter)
app.use('/quiz', quizRouter)
app.use('/messages', messagesRouter)
app.set('socketio', io)
const port = 5000

app.use(express.static(path.join(__dirname, 'public')))
mongoose.set('strictQuery', false)
mongoose
  .connect('mongodb://127.0.0.1:27017/PFE-Chaima-Dorsaf')
  .then(() => {
    console.log('connected to db')
  })
  .catch((error) => {
    console.log(`Error : ${error.message}`)
  })

const createDefaultAdmin = async () => {
  const admins = await Admin.find()
  if (admins.length === 0) {
    var hashedPassword = await bcrypt.hash('admin', 10)
    const defaultAdmin = new Admin({
      cin: '0000',
      prenom: 'defaultAdmin',
      nom: 'defaultAdmin',
      email: 'defaultAdmin@rira.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    })
    defaultAdmin.save((err) => {
      if (err) {
        console.log(err)
      } else console.log('defaultAdmin created')
    })
  }
}

createDefaultAdmin()

io.on('connection', (client) => {
  client.emit('getSocketId', { socketId: client.id })

  client.on('setUser', async (data) => {
    var user
    if (data.userId === null) return

    user = await Etudiant.findById(data.userId)
    if (user === null) {
      user = await Prof.findById(data.userId)
    }

    if (user !== null) {
      user.socketId = data.socketId
      user.save((error, savedUser) => {})
    }
  })

  client.on('send_message', (data) => {
    //enregistrement du message dans la BD
    const message = new Message({
      message: data.message,
      nomSender: data.nomSender,
      date: new Date(),
      idSender: data.idSender,
    })
    message.save(async (error, savedMessage) => {
      if (error) io.emit({ error: error.message })
    })
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

server.listen(port, () => {
  console.log('SERVER RUNNING ON PORT : ' + port)
})

module.exports = io
