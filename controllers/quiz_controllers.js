var models=require('../models/models.js');

exports.load=function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz=quiz;
			next();
		}else{
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function (err) {
		next(err);
	});
};

exports.index=function(req,res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index',{quizes:quizes});
	});
}

exports.show=function(req,res) {
	/*models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render("quizes/show",{quiz:quiz});
	});*/
	res.render("quizes/show",{quiz:req.quiz});
};

exports.answer=function (req, res) {
	/*models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta===quiz.respuesta) {
			res.render("quizes/answer",{quiz:quiz, respuesta:"Correcto"});
		} else {
			res.render("quizes/answer",{quiz:quiz, respuesta:"Incorrecto"});
		}
	});*/
	var resultado="Incorrecto";
	if (req.query.respuesta===req.quiz.respuesta) {
		resultado='Correcto';
	}
	res.render("quizes/answer",{quiz:req.quiz, respuesta:resultado});
};

exports.author=function(req,res){
	res.render("author");
};