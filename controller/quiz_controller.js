var models = require('../models/models');

exports.load = function(req,res,next, quizId){
    models.Quiz.find({
        where: { id: Number(quizId) },
        include: [{ model: models.Comment }]
    }).then(function(quiz){
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
                    .save({fields: ["pregunta", "respuesta", "tema"]})
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
    req.quiz.tema = req.body.quiz.tema;

    req.quiz
    .validate()
    .then(function(err){
            if(err){
                res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
            }
            else {
                req.quiz
                    .save({fields: ["pregunta", "respuesta", "tema"]})
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

exports.statistics = function(req,res,next){
    var statistics= {
        numPreguntas:0,
        numPreguntasConComments:0,
        numPreguntasSinComments:0,
        numComments:0,
        mediaComments:0
    };

    models.Quiz.count()
        .then (function (numPreguntas) { //numero de preguntas
        statistics.numPreguntas = numPreguntas;
        models.Comment.count().then(function(numCommnets){
            statistics.numComments = numCommnets;
            models.sequelize.query('SELECT count(Distinct("QuizId")) FROM "Comments"', { type: models.sequelize.QueryTypes.SELECT})
                .then(function(pregConcoments){
                    var c = 0;
                    for(var x in pregConcoments)
                    {
                        for(var z in pregConcoments[x])
                            c+= pregConcoments[x][z];
                    }
                    statistics.numPreguntasConComments = Number(c);
                    statistics.numPreguntasSinComments = numPreguntas - c;
                    statistics.mediaComments = (numCommnets/ numPreguntas);
                    res.render ('quizes/statistics', {statistics: statistics, errors: []});
                }).catch(function(error) {next(error);});
        }).catch(function(error) {next(error);});
    }).catch(function(error) {next(error);});
};