exports.question = function(req, res){
    res.render('quizes/question', { pregunta : 'Capital de Italia', title: 'Quiz'});
}

exports.answer = function(req,res){
    if(req.query.respuesta === 'Roma') {
        res.render('quizes/answer', {respuesta: 'Correcto', title: 'Quiz'});
    } else {
        res.render('quizes/answer', {respuesta: 'incorrecto', title: 'Quiz'});
    }
}