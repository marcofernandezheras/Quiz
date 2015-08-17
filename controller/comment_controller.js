var models = require('../models/models');

exports.new = function(req,res){
    res.render('comments/new.ejs', {quizid: req.params.quizId, errors: [] } );
}

exports.createComment = function(req,res){
    var comment = models.Comment.build(
        {
            texto: req.body.comment.texto,
            QuizId: req.params.quizId
        }
    );

    comment.validate().then(
        function(err){
            if(err){
                res.render('comments/new.ejs',
                    {comment: comment, quizid:req.params.quizId, errors:err.errors});
            }
            else{
                comment.save().then(
                    res.redirect('/quizes/'+req.params.quizId)
                );
            }
        }
    );
};