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
    res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

exports.answer = function(req,res){
    var correcto = "Incorrecto";
    if(req.query.respuesta === req.quiz.respuesta) {
        correcto = 'Correcto';
    }
    res.render('quizes/answer', {quiz: req.quiz,  respuesta: correcto, errors: []});
};

exports.index = function(req, res){
    if(req.query.search)
    {
        var searchString = '%' + req.query.search + '%';
        searchString = searchString.replace(' ','%');
        models.Quiz.findAll({where: ["pregunta like ?", searchString]}).then(function (quiz) {
            res.render('quizes/index.ejs', {quizes: quiz, errors: []});
        });
    }
    else {
        models.Quiz.findAll().then(function (quiz) {
            res.render('quizes/index.ejs', {quizes: quiz, errors: []});
        });
    }
};

exports.new = function(req,res){
    var quiz = models.Quiz.build(
        { pregunta: "Pregunta", respuesta: "Respuesta" }
    );
    res.render('quizes/new', { quiz: quiz, errors: []});
}

exports.createQuiz = function(req,res){
    var quiz = models.Quiz.build( req.body.quiz );


    quiz
        .validate()
        .then(
        function(err){
            if (err) {
                res.render('quizes/new', {quiz: quiz, errors: err.errors});
            } else {
                quiz
                    .save({fields: ["pregunta", "respuesta"]})
                    .then( function(){ res.redirect('/quizes')})
            }
        }
    );
};

exports.edit = function(req,res){
    res.render('quizes/edit', {quiz: req.quiz , errors: []});
};

exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;

    req.quiz
    .validate()
    .then(function(err){
            if(err){
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            }
            else {
                req.quiz
                    .save({fields: ["pregunta", "respuesta"]})
                    .then( function(){ res.redirect('/quizes')});
            }
        });
};


exports.destroy = function(req,res){
    req.quiz.destroy().then( function(){
        res.redirect('/quizes');
    } )
    .catch(function(error){next(error);});
};







