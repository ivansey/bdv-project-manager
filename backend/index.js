let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let md5 = require('md5');
let cors = require('cors');
let fileUpload = require('express-fileupload');
let nodemailer = require('nodemailer');

let smtp;

try {
	smtp = nodemailer.createTransport({
		host: 'smtp.yandex.ru',
		port: 465,
		secure: true,
		auth: {
			user: 'root@ivansey.ru',
			pass: '20021212Qq'
		},
		tls: {
			ciphers: 'SSLv3'
		}
	});
} catch (e) {
	console.error(e);
}

const PORT = 3001;

mongoose.connect("mongodb://localhost/bdv");

let usersModel = require('./models/users');
let userSessionModel = require('./models/userSession');
let newsModel = require('./models/news');
let newsLikesModel = require('./models/newsLikes');
let newsCommentsModel = require('./models/newsCommets');
let projectsModel = require('./models/projects');

let app = express();

app.use(bodyParser());
app.use(cors());
app.use(fileUpload());

app.post("/api/v1/users/reg", (req, res) => {
	usersModel.find({email: req.body.email}).then(data => {
			if (data.length > 0) {
				res.json({response: "EMAIL_NOT_FREE"});
			} else {
				let user = new usersModel({
					email: req.body.email,
					pass: md5(req.body.pass),
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					type: "user",
					balance: 10000,
					active: false
				});
				user.save();
				let output = `<h1>BDV - Бизнес Делая Вместе</h1>\n
                    <h2>Подверждение регистрации</h2><br/>\n
                    <p>Для работы с сервисом необходимо подтвердить, что вы реальный человек. Сделать это можно перейдя по ссылке выше</p><br/>\n
                    <a href="http://ivansey.ru/activate/${user._id}">Активировать аккаунт</a>`
				let mailOptions = {
					from: 'root@ivansey.ru',
					to: req.body.email,
					subject: 'BDV - Подверждение регистрации',
					text: 'BDV - Подверждение регистрации',
					html: output
				};
				smtp.sendMail(mailOptions, (error, info) => {
					if (error) {
						console.error(error);
					} else {
						console.log('send');
					}
				});
				res.json({response: "USER_ADD"});
			}
		}
	);
});

app.post("/api/v1/users/login", (req, res) => {
	usersModel.find({email: req.body.email}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_USER", token: null});
		} else {
			if (data[0].pass !== md5(req.body.pass)) {
				res.json({response: "INVALID_PASSWORD", token: null});
			}
			
			let session = new userSessionModel({idUser: data[0]._id});
			
			let token = session.generateToken();
			session.token = token;
			
			session.save();
			res.json({response: "USER_LOGIN", token: token});
		}
	})
});

app.post("/api/v1/users/checkToken", (req, res) => {
	userSessionModel.find({token: req.body.token}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_TOKEN", id: null});
		}
		
		res.json({response: "CHECK_TOKEN_DONE", id: data[0].idUser});
	});
});

app.post("/api/v1/users/get", (req, res) => {
	usersModel.find({_id: req.body.idUser}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_USER", data: {}});
		} else {
			res.json({
				response: "USER_FOUND", data: data[0]
			});
		}
	});
});

app.post("/api/v1/users/activate", (req, res) => {
	usersModel.findByIdAndUpdate(req.body.id, {active: true}).then((data) => {
		console.log("ccc")
		if (data.length === 0) {
			res.send("Этот url поврежден");
		} else {
			console.log("eee")
		}
	});
});

app.post("/api/v1/users/addMoney", (req, res) => {
	usersModel.find({_id: req.body.id}).then(data => {
		usersModel.findByIdAndUpdate(req.body.id, {balance: data[0].balance + req.body.value});
		res.json({response: "DONE"});
	});
});

app.post("/api/v1/users/delMoney", (req, res) => {
	usersModel.find({_id: req.body.id}).then(data => {
		usersModel.findByIdAndUpdate(req.body.id, {balance: data[0].balance + req.body.value});
		res.json({response: "DONE"});
	});
});

app.post("/api/v1/news/add", (req, res) => {
	userSessionModel.find({token: req.body.token}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "ACCESS_DENIED"});
		}
		
		usersModel.find({_id: data[0].idUser}).limit(1).then(data => {
			if (data[0].type !== "admin") {
				res.json({response: "ACCESS_DENIED"});
			}
			
			let date = new Date();
			
			let news = new newsModel({
				title: req.body.title,
				img: req.body.img,
				text: req.body.text,
				desc: req.body.desc,
				time: date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
			});
			news.save();
			console.log(req.body);
			res.json({response: "NEWS_ADD"});
		});
	});
});

app.post("/api/v1/news/list", (req, res) => {
	newsModel.find({}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_NEWS", data: {}});
		} else {
			res.json({response: "NEWS_FOUND", data: data});
		}
	});
});

app.post("/api/v1/news/get", (req, res) => {
	newsModel.find({_id: req.body.id}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_NEWS", data: {}});
		} else {
			res.json({response: "NEWS_FOUND", data: data});
		}
	});
});

app.post("/api/v1/news/delete", (req, res) => {
	userSessionModel.find({token: req.body.token}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "ACCESS_DENIED"});
		}
		usersModel.find({_id: data[0].idUser}).limit(1).then(data => {
			if (data[0].type !== "admin") {
				res.json({response: "ACCESS_DENIED"});
			}
			
			newsModel.findByIdAndRemove(req.body.id).then(data => {
				res.json({response: "NEWS_DELETED", data: data});
			});
		});
	});
});

app.post("/api/v1/news/getLikes", (req, res) => {
	newsLikesModel.find({idNews: req.body.id}).then(data => {
		res.json({response: "DONE", data: data.length});
	});
});

app.post("/api/v1/news/addLike", (req, res) => {
	userSessionModel.find({token: req.body.token}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "ACCESS_DENIED"});
		}
		
		let like = new newsLikesModel({
			idNews: req.body.id,
			idUser: req.body.idUser
		});
		
		newsLikesModel.find({idNews: req.body.id, idUser: req.body.idUser}).then(data => {
			if (data.length === 0) {
				like.save();
				res.json({response: "ADD_LIKE"});
			}
		});
	});
});

app.post("/api/v1/news/getComments", (req, res) => {
	newsCommentsModel.find({idNews: req.body.id}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_COMMENTS", data: []});
		}
		
		res.json({response: "DONE", data: data});
	});
});

app.post("/api/v1/news/addComment", (req, res) => {
	userSessionModel.find({token: req.body.token}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "ACCESS_DENIED"});
		}
		
		usersModel.find({_id: req.body.idUser}).limit(1).then(data => {
			console.log(data);
			let comment = new newsCommentsModel({
				idNews: req.body.id,
				idUser: req.body.idUser,
				text: req.body.text,
				firstName: data[0].firstName
			});
			
			comment.save();
			res.json({response: "ADD_COMMENT"});
		});
	});
});

app.post("/api/v1/storage/img/upload", (req, res) => {
	let imageFile = req.files.file;
	
	let date = Date();
	
	imageFile.mv(`../public/storage/img/${md5(date + req.body.idUser)}.jpg`, err => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		
		res.json({file: `/storage/img/${md5(date + req.body.idUser)}.jpg`});
	})
});

app.post("/api/v1/projects/add", (req, res) => {
	userSessionModel.find({token: req.body.token}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "ACCESS_DENIED"});
		}
		
		usersModel.find({_id: req.body.idUser}).then(data2 => {
			if (data2[0].balance < 1500) {
				res.json({response: "NOT_MONEY"});
				return
			}
			usersModel.findByIdAndUpdate(req.body.idUser, {balance: data2[0].balance - req.body.value}).then(data3 => {
				console.log(data3);
			});
		});
		
		projectsModel.find().then(data => {
			let date = new Date();
			
			let id = data.length + 1;
			
			let project = new projectsModel({
				title: req.body.title,
				category: req.body.category,
				img: req.body.img,
				text: req.body.text,
				desc: req.body.desc,
				textPlus: req.body.textPlus,
				time: date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
				active: true,
				phone: req.body.phone,
				email: req.body.email,
				idUser: req.body.idUser,
				id: id
			});
			project.save();
			
			// Отправка инструкций
			let output = `<h1>BDV - Бизнес Делая Вместе</h1>
                    <h2>Проект создан</h2>
                    <div>Проект создан</div>
					<a href="http://ivansey.ru/projects/get/${project._id}">Открыть проект на сайте</a>`
			let mailOptions = {
				from: 'root@ivansey.ru',
				to: req.body.email,
				subject: 'BDV - Проект создан',
				text: 'BDV - Проект создан',
				html: output
			};
			smtp.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error(error);
				}
			});
			
			// Отправка данных о проекте
			output = `<h1>BDV - Бизнес Делая Вместе</h1>
               		<h2>Уведомление о новом проекте</h2>
                    <div>Имя: ${project.title}</div><br/>
                    <div>Номер: ${project.id}</div><br/>
                    <div>Уникальный индификатор: ${project._id}</div><br/>
                    <div>Категория: ${project.category}</div><br/>
                    <div>Краткое описание: <br/>${project.desc}</div><br/>
					<div>Описание: <br/>${project.text}</div><br/>
					<div>Дополнительное (предложение или требование): <br/>${project.textPlus}</div><br/>
					<div>Время создания: ${project.time} по МСК</div><br/>
					<div>Телефон: ${project.phone}</div><br/>
					<div>EMail: ${project.email}</div><br/>
					<a href="http://ivansey.ru/projects/get/${project._id}">Открыть проект</a>`
			mailOptions = {
				from: 'root@ivansey.ru',
				to: 'bdvcool@yandex.ru',
				subject: `BDV - Уведомление о новом проекте #${project.id}`,
				text: `BDV - Уведомление о новом проекте #${project.id}`,
				html: output
			};
			smtp.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.error(error);
				}
			});
		});
	});
	res.json({response: "PROJECT_ADD"});
});

app.post("/api/v1/projects/list", (req, res) => {
	projectsModel.find({category: req.body.category}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_PROJECTS", data: {}});
		} else {
			res.json({response: "PROJECTS_FOUND", data: data});
		}
	});
});

app.post("/api/v1/projects/get", (req, res) => {
	projectsModel.find({_id: req.body.id}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_PROJECTS", data: {}});
		} else {
			console.log(data);
			res.json({response: "PROJECT_FOUND", data: data[0]});
		}
	});
});

app.get("/api/v1/setup/google/getUrl", (req, res) => {

});


app.listen(PORT, () => console.log("Server started on port " + PORT));
