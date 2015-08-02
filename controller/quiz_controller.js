var models = require('../models/models');

exports.load = function(req,res,next, quizId){
    models.Quiz.find(quizId).then(
        function(quiz){
            if(quiz){
                req.quiz = quiz;
                next();
        } else { next(new Error('No existe el quiz='+quizId)); }
    }
    ).catch(function(error){ next(error); })
};


exports.show = function(req, res){
    res.render('quizes/show', { quiz: req.quiz });
};

exports.answer = function(req,res){
    if(req.query.respuesta === req.quiz.respuesta) {
        res.render('quizes/answer', {quiz: req.quiz,  respuesta: 'Correcto'});
    } else {
        res.render('quizes/answer', {quiz: req.quiz,  respuesta: 'incorrecto'});
    }
};

exports.index = function(req, res){
    if(req.query.search)
    {
        var searchString = '%' + req.query.search + '%';
        searchString = searchString.replace(' ','%');
        models.Quiz.findAll({where: ["pregunta like ?", searchString]}).then(function (quiz) {
            res.render('quizes/index.ejs', {quizes: quiz});
        });
    }
    else {
        models.Quiz.findAll().then(function (quiz) {
            res.render('quizes/index.ejs', {quizes: quiz});
        });
    }
};















