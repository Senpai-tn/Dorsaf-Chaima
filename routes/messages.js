const express = require('express')
const Message = require('../models/Message')
const messagesRouter = express.Router()

messagesRouter.get('/', async (req, res) => {
  const messages = await Message.find()
  res.send(messages)
})

module.exports = messagesRouter
