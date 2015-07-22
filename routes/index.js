var express = require('express');
var router = express.Router();

var quiz = require('../controller/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

router.get('/author', function(req, res) {
    res.render('author');
});

router.get('/quizes/question', quiz.question);

router.get('/quizes/answer', quiz.answer);

module.exports = router;
