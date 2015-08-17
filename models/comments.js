module.exports = function(sequelize, Datatypes){
    return sequelize.define(
        'Comment',
        {
            texto:{
                type: Datatypes.STRING,
                validate: { notEmpty: { msg: '-> Falta Comentario' } }
            },
            publicado:{
                type: Datatypes.BOOLEAN,
                defaultValue: false
            }
        }
    );
};
