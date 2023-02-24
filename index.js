const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const Prof = require('./models/Prof')
const userRouter = require('./routes/user')
const etudiantRouter = require('./routes/etudiant')
const app = express()
app.use(cors())
app.use(express.json())

app.use('/etudiant', etudiantRouter)
app.use('/user', userRouter)
const port = 5000
console.log('Git Chaima awel marra ')
mongoose
  .connect('mongodb://127.0.0.1:27017/PFE-Chaima-Dorsaf')
  .then(() => {})
  .catch((error) => {
    console.log(`Error : ${error.message}`)
  })

app.listen(port, () => {
  console.log(`Application listenning on port ${port}`)
})
