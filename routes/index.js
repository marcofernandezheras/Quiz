var express = require('express');
var router = express.Router();

var quiz = require('../controller/quiz_controller');
var commentController = require('../controller/comment_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

router.get('/author', function(req, res) {
    res.render('author', { errors: []});
});

router.param('quizId', quiz.load);

router.get('/quizes', quiz.index);
router.get('/quizes/:quizId(\\d+)', quiz.show);
router.get('/quizes/:quizId(\\d+)/answer', quiz.answer);
router.get('/quizes/new', quiz.new);
router.post('/quizes/create', quiz.createQuiz);
router.get('/quizes/:quizId(\\d+)/edit', quiz.edit);
router.put('/quizes/:quizId(\\d+)', quiz.update);
router.delete('/quizes/:quizId(\\d+)', quiz.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.createComment);

module.exports = router;
