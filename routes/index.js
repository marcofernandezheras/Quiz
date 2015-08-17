var express = require('express');
var router = express.Router();

var quiz = require('../controller/quiz_controller');
var commentController = require('../controller/comment_controller');
var sessionController = require('../controller/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' , errors: []});
});

router.get('/author', function(req, res) {
    res.render('author', { errors: []});
});

router.param('quizId', quiz.load);
router.param('commentId', commentController.load);

router.get('/login', sessionController.new);
router.post('/login', sessionController.createSession);
router.get('/logout', sessionController.destroy);

router.get('/quizes', quiz.index);
router.get('/quizes/:quizId(\\d+)', quiz.show);
router.get('/quizes/:quizId(\\d+)/answer', quiz.answer);
router.get('/quizes/new', sessionController.loginRequired, quiz.new);
router.post('/quizes/create', sessionController.loginRequired, quiz.createQuiz);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quiz.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quiz.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quiz.destroy);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.createComment);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;
