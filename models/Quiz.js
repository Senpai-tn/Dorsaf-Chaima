const mongoose = require('mongoose')
const { Schema } = mongoose

const quizSchema = new Schema({
  type: { type: String, required: true },
  createdAd: { type: Date, default: Date.now },
  questions: { type: Array, required: true },
  answers: { type: Array, default: [] },
  result: { type: Number, default: 0 },
  user: Object,
  cours: Object,
})

const Quiz = mongoose.model('quiz', quizSchema)
module.exports = Quiz
