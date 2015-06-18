var models=require('../models/models.js');

exports.load=function(req, res, next, quizId) {
	models.Quiz.find({
		where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then(function(quiz) {
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

exports.index = function (req, res) {
	var search = req.query.search;
	if (search) {
		search = search.replace(' ', '%');
		models.Quiz.findAll({ 
			where: ["pregunta like ?", '%' + search + '%']
		}).then(function (quizes) {
			res.render('quizes/index', { quizes: quizes, filtrado: true, errors:[] });
		});
	} else {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index', { quizes: quizes, filtrado: false, errors:[] });
		});
	}
};

exports.show=function(req,res) {
	/*models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render("quizes/show",{quiz:quiz});
	});*/
	res.render("quizes/show",{quiz:req.quiz,errors:[]});
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
	res.render("quizes/answer",{quiz:req.quiz, respuesta:resultado, errors:[]});
};

exports.new = function (req, res) {
	var quiz = models.Quiz.build({
		pregunta: "Pregunta",
		respuesta:"Respuesta"
	});
	
	res.render('quizes/new',{quiz:quiz, errors:[]});
};

exports.create = function (req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/new',{quiz:quiz, errors:err.errors});
		} else {
			quiz.save({fields:["pregunta","respuesta","tema"]}).then(function() {
				res.redirect('/quizes');
			});
		}
	});
};

exports.edit = function (req, res) {
	var quiz = req.quiz;
	
	res.render('quizes/edit', {quiz:quiz, errors:[]});
};

exports.update = function (req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate().then(function (err) {
		if (err) {
			res.render('quizes/edit', {quiz:req.quiz, errors:err.errors});			
		} else {
			req.quiz.save({fields:["pregunta","respuesta","tema"]}).then(function() {
				res.redirect('/quizes');
			});
		}
	});
};

exports.destroy = function (req, res) {
	req.quiz.destroy().then(function () {
		res.redirect('/quizes');
	}).catch(function (error) {
		next(error);
	});
};

exports.author=function(req,res){
	res.render("author",{errors:[]});
};