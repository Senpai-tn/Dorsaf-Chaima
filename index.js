const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Prof = require('./models/Prof')
const userRouter = require('./routes/user')
const etudiantRouter = require('./routes/etudiant')
const coursRouter = require('./routes/cours')
const app = express()
app.use(cors())
app.use(express.json())

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

app.listen(port, () => {
  console.log(`Application listenning on port ${port}`)
})
