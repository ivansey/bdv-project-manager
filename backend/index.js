let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let md5 = require('md5');
let cors = require('cors');
let fileUpload = require('express-fileupload');
let nodemailer = require('nodemailer');
let moment = require('moment');

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
let cartModel = require('./models/cart');

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
					type: "admin",
					balance: 10000,
					active: false
				});
				user.save();
				let output = `<h1>BDV - Бизнес Делая Вместе</h1>\n
                    <h2>Подверждение регистрации</h2><br/>\n
                    <p>Для работы с сервисом необходимо подтвердить, что вы реальный человек. Сделать это можно перейдя по ссылке выше</p><br/>\n
                    <a href="http://biznesdeystvuyavmeste.ru/activate/${user._id}">Активировать аккаунт</a>`
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

app.post("/api/v1/cart/add", (req, res) => {
	userSessionModel.find({token: req.body.token}).then(data => {
		if (data.length === 0) {
			console.log("ACCESS_DENIED");
			res.json({response: "ACCESS_DENIED"});
		}
		
		let cart = new cartModel({
			text: req.body.text,
			phone: req.body.phone,
			email: req.body.email,
			idUser: req.body.idUser,
			idProject: req.body.idProject
		});
		cart.save();
		
		// Отправка инструкций
		let output = `<h1>BDV - Бизнес Делая Вместе</h1>
                    <h2>Добавлен проект в кейс</h2>
                    <div>Вы добавили в проект в кейс</div>`
		let mailOptions = {
			from: 'root@ivansey.ru',
			to: req.body.email,
			subject: 'BDV - Добавлен проект в кейс',
			text: 'BDV - Добавлен проект в кейс',
			html: output
		};
		smtp.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
			}
		});
		
		// Отправка данных о проекте
		output = `<h1>BDV - Бизнес Делая Вместе</h1>
               		<h2>Добавлен проект в кейс</h2>
					<div>Описание: <br/>${cart.text}</div><br/>
					<div>Телефон: ${cart.phone}</div><br/>
					<div>EMail: ${cart.email}</div><br/>
					<a href="http://ivansey.ru/projects/get/${cart.idProject}">Открыть проект</a>`
		mailOptions = {
			from: 'root@ivansey.ru',
			to: 'bdvcool@yandex.ru',
			subject: `BDV - Добавлен проект в кейс`,
			text: `BDV - Добавлен проект в кейс`,
			html: output
		};
		smtp.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error(error);
			}
		});
	});
	res.json({response: "CART_ADD"});
});

app.post("/api/v1/cart/list", (req, res) => {
	cartModel.find({}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_CART", data: {}});
		} else {
			res.json({response: "CART_FOUND", data: data});
		}
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
		
		let cost = 1500;
		
		if (req.body.category === "kids") {
			cost = 300;
		}
		
		usersModel.find({_id: req.body.idUser}).then(data2 => {
			if (data2[0].balance < cost) {
				res.json({response: "NOT_MONEY"});
				return
			}
			usersModel.findByIdAndUpdate(req.body.idUser, {balance: data2[0].balance - cost}).then();
		});
		
		projectsModel.find().then(data => {
			let date = new Date();
			
			let id = data.length + 1;
			
			let dateString = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			
			let project = new projectsModel({
				title: req.body.title,
				category: req.body.category,
				img: req.body.img,
				text: req.body.text,
				desc: req.body.desc,
				textPlus: req.body.textPlus,
				time: moment(date).format("D/M/YYYY H:m:s"),
				timePayment: moment(dateString).add(240, "days").format("D/M/YYYY"),
				active: true,
				phone: req.body.phone,
				email: req.body.email,
				idUser: req.body.idUser,
				id: id,
				plusLevel: 0,
				tags: req.body.tags
			});
			project.save();
			
			// Отправка инструкций
			let output = `<h1>BDV - Бизнес Делая Вместе</h1>
                    <h2>Проект создан</h2>
                    <div>Проект создан</div>
					<a href="http://biznesdeystvuyavmeste.ru/projects/get/${project._id}">Открыть проект на сайте</a>`
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
					<a href="http://biznesdeystvuyavmeste.ru/projects/get/${project._id}">Открыть проект</a>`
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
	if (req.body.category === 'all') {
		projectsModel.find({active: true}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_PROJECTS", data: {}});
			} else {
				res.json({response: "PROJECTS_FOUND", data: data});
			}
		});
	} else {
		projectsModel.find({
			category: req.body.category,
			active: true
		}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_PROJECTS", data: {}});
			} else {
				res.json({response: "PROJECTS_FOUND", data: data});
			}
		});
	}
});

app.post("/api/v1/projects/search", (req, res) => {
	if (req.body.category === 'all') {
		projectsModel.find({active: true, $text: {$search: req.body.search}}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_SEARCH", data: {}});
			} else {
				console.log(data);
				res.json({response: "SEARCH_FOUND", data: data});
			}
		});
	} else {
		projectsModel.find({
			category: req.body.category,
			active: true,
			$text: {$search: req.body.search}
		}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_SEARCH", data: {}});
			} else {
				res.json({response: "SEARCH_FOUND", data: data});
			}
		});
	}
});

app.post("/api/v1/users/projects/list", (req, res) => {
	if (req.body.category === 'all') {
		projectsModel.find({active: true, idUser: req.body.id}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_PROJECTS", data: {}});
			} else {
				res.json({response: "PROJECTS_FOUND", data: data});
			}
		});
	} else {
		projectsModel.find({
			category: req.body.category,
			active: true,
			idUser: req.body.id
		}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
			if (data.length === 0) {
				res.json({response: "NOT_PROJECTS", data: {}});
			} else {
				res.json({response: "PROJECTS_FOUND", data: data});
			}
		});
	}
});

app.post("/api/v1/projects/listTop", (req, res) => {
	projectsModel.find({
		active: true,
		plusLevel: req.body.level
	}).limit(req.body.limit).sort({name: 'asc'}).then(data => {
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

app.post("/api/v1/projects/edit", (req, res) => {
	projectsModel.find({_id: req.body.id}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_PROJECTS", data: {}});
		} else {
			projectsModel.findByIdAndUpdate(data[0]._id, {
				title: req.body.title,
				category: req.body.category,
				text: req.body.text,
				desc: req.body.desc,
				textPlus: req.body.textPlus,
				phone: req.body.phone,
				email: req.body.email
			}).then(() => {
				res.json({response: "EDITED", data: data[0]});
			});
		}
	});
});

app.post("/api/v1/projects/addLevel", (req, res) => {
	console.log(req.body);
	projectsModel.find({_id: req.body.id}).limit(1).then(data => {
		if (data.length === 0) {
			res.json({response: "NOT_PROJECTS", data: {}});
		} else {
			let cost;
			
			if (req.body.level === 1) {
				cost = 5000;
			}
			
			usersModel.find({_id: req.body.idUser}).then(data => {
				if (data[0].balance < cost) {
					res.json({response: "NOT_MONEY"});
					return
				}
				
				usersModel.findByIdAndUpdate(req.body.idUser, {balance: data[0].balance - cost}).then(data => {
					projectsModel.findByIdAndUpdate(req.body.id, {
						plusLevel: req.body.level
					}).then(data => {
						res.json({response: "EDITED", data: data[0]});
					});
				});
			});
		}
	});
});

setInterval(() => {
	let now = moment(new Date());
	let cost = 30;
	projectsModel.find().then(data => {
		for (let project in data) {
			if (now.format("D/M/YYYY") >= moment(project.timePayment).format("D/M/YYYY")) {
				usersModel.find({_id: project.idUser}).then(data2 => {
					if (data2[0].balance >= cost) {
						usersModel.findByIdAndUpdate(data2[0]._id, {balance: data2[0].balance - 30});
						output = `<h1>BDV - Бизнес Делая Вместе</h1>
		                    <h2>Уведомление о продлении размещения проекта</h2>
		                    <div>Прошло 240 дней, и пришла пора оплачивать размещение проекта. Оно стоит 30 рублей за каждые 240 дней. Они у вас изьяты из счёта. Остаток: ${data2[0].balance} RUB</div>
							<a href="http://biznesdeystvuyavmeste.ru/projects/get/${project._id}">Открыть проект</a>`
						mailOptions = {
							from: 'root@ivansey.ru',
							to: data2[0].email,
							subject: `BDV - Уведомление о продлении размещения проекта #${project.id}`,
							text: `BDV - Уведомление о продлении размещения проекта #${project.id}`,
							html: output
						};
						smtp.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.error(error);
							}
						});
					} else {
						projectsModel.findByIdAndUpdate(project._id, {
							active: false,
							timePayment: moment(now).add(60, "days").format("D/M/YYYY")
						});
						output = `<h1>BDV - Бизнес Делая Вместе</h1>
		                    <h2>Уведомление о продлении размещения проекта</h2>
		                    <div>Прошло 240 дней, и пришла пора оплачивать размещение проекта. Оно стоит 30 рублей за каждые 240 дней. У вас не достаточно средств для этого. Остаток: ${data2[0].balance} RUB</div>
							<a href="http://biznesdeystvuyavmeste.ru/projects/get/${project._id}">Открыть проект</a>`
						mailOptions = {
							from: 'root@ivansey.ru',
							to: data2[0].email,
							subject: `BDV - Уведомление о продлении размещения проекта #${project.id}`,
							text: `BDV - Уведомление о продлении размещения проекта #${project.id}`,
							html: output
						};
						smtp.sendMail(mailOptions, (error, info) => {
							if (error) {
								console.error(error);
							}
						});
					}
				});
			}
		}
	});
}, 86400000)

app.listen(PORT, () => console.log("Server started on port " + PORT));
