const { randomInt } = require('crypto')
var express = require('express')
const Quiz = require('../models/Quiz')
const Cours = require('../models/Cours')
const Etudiant = require('../models/Etudiant')
var router = express.Router()

/* GET questions */
router.get('/:matiere', async (req, res) => {
  try {
    var jsonData = require('../public/quiz/' + req.params.matiere + '.json')
    var array = []
    while (array.length < 8) {
      var x = randomInt(jsonData.length)
      if (array.indexOf(x) == -1 && x > 0) {
        array.push(x)
      }
    }
    var questions = []
    array.map((value) => {
      questions.push({
        id: jsonData[value - 1].id,
        question: jsonData[value - 1].question,
        answers: jsonData[value - 1].answers,
      })
    })
    res.send({ array: array, questions: questions })
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

/* Validate Quiz */
router.post('/', async (req, res) => {
  var answers = req.body.formData
  var allQuestions = require('../public/quiz/' + req.body.matiere + '.json')
  var questions = []
  var finalResult = 0
  const percent = 100 / req.body.array.length
  req.body.array.map((i) => {
    questions.push(allQuestions[i - 1])
  })
  answers.map((q) => {
    if (q.value == allQuestions[q.key - 1].correctAnswer) finalResult++
  })
  var exam = new Quiz()
  exam.type = req.body.matiere
  exam.questions = questions
  exam.answers = answers
  exam.result = finalResult * percent
  exam.user = req.body.user
  exam.cours = req.body.cours
  await exam.save(async (e, savedExam) => {
    if (e != null) {
      res.send(e)
    } else res.send({ exam: savedExam })
  })
})

module.exports = router
