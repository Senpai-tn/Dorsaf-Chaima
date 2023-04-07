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
      console.log(value, jsonData[value - 1])
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

module.exports = router
