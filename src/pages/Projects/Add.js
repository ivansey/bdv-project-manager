import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect, Link} from 'react-router-dom';

class ProjectAdd extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: "",
			user: {},
			empty: false,
			title: "",
			text: "",
			desc: "",
			textPlus: "",
			phone: "",
			email: "",
			img: "",
			category: "invention",
			tags: ""
		};
		
		this.getInfo = this.getInfo.bind(this);
		this.checkToken = this.checkToken.bind(this);
		this.addProject = this.addProject.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		
		this.handleTitle = this.handleTitle.bind(this);
		this.handleText = this.handleText.bind(this);
		this.handleDesc = this.handleDesc.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.handleTextPlus = this.handleTextPlus.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
		this.handleTags = this.handleTags.bind(this);
		
		this.checkFields = this.checkFields.bind(this);
		this.turnOffError = this.turnOffError.bind(this);
		
		this.checkToken();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then((data) => {
			this.setState({user: data.data.data});
		});
	};
	
	addProject = () => {
		if (this.state.user.id !== "") {
			if (this.checkFields) {
				axios.post('/api/v1/projects/add', {
					idUser: this.state.user._id,
					title: this.state.title,
					text: this.state.text,
					desc: this.state.desc,
					img: this.state.img,
					textPlus: this.state.textPlus,
					phone: this.state.phone,
					email: this.state.email,
					token: cookie.load("token"),
					category: this.state.category,
					tags: this.state.tags
				}).then((data) => {
					this.setState({response: "LOADING"});
					this.setState({response: data.data.response});
				});
			}
		}
	};
	
	uploadFile;
	
	uploadImg = (ev) => {
		ev.preventDefault();
		
		const data = new FormData();
		data.append('file', this.uploadFile.files[0]);
		data.append('idUser', this.state.user._id);
		
		axios.post("/api/v1/storage/img/upload", data).then(data => {
			this.setState({img: data.data.file})
		});
	};
	
	checkToken = () => {
		if (cookie.load('token')) {
			axios.post('/api/v1/users/checkToken', {
				token: cookie.load('token'),
			}).then((data) => {
				if (data.data.response !== "NOT_TOKEN") {
					this.setState({idUser: data.data.id, status: "USER"});
					this.getInfo();
				}
			});
		}
	};
	
	handleTitle = (e) => {
		this.setState({title: e.target.value});
		this.turnOffError();
	};
	
	handleTags = (e) => {
		this.setState({tags: e.target.value});
		this.turnOffError();
	};
	
	handleText = (e) => {
		this.setState({text: e.target.value});
		this.turnOffError();
	};
	
	handleDesc = (e) => {
		this.setState({desc: e.target.value});
		this.turnOffError();
	};
	
	handleCategory = (e) => {
		this.setState({category: e.target.value});
		this.turnOffError();
	};
	
	handleTextPlus = (e) => {
		this.setState({textPlus: e.target.value});
		this.turnOffError();
	};
	
	handlePhone = (e) => {
		this.setState({phone: e.target.value});
		this.turnOffError();
	};
	
	handleEmail = (e) => {
		this.setState({email: e.target.value});
		this.turnOffError();
	};
	
	checkFields = () => {
		if (this.state.title === "" || this.state.text === "" || this.state.desc === "" || this.state.phone === "" || this.state.email === "") {
			this.setState({empty: true});
			return false;
		}
		return true;
	};
	
	turnOffError = () => {
		this.setState({empty: false});
	};
	
	render() {
		return <div className="page" id="newsAdd">
			<h3 className="title">Добавление новости</h3>
			{
				this.state.category === "kids"
					? <p>Цена добавления: 300 RUB</p>
					: <p>Цена добавления: 1500 RUB</p>
			}
			<p>Вы оплачиваете размещение проекта за первые 240 дней, далее цена размещения за 60 дней будет равна 60 RUB</p>
			{
				this.state.user.balance >= 1500 && this.state.user.balance !== undefined
					? <p>У Вас на счету {this.state.user.balance}</p>
					: <p>У вас не достаточно денег на счету (необходимо ещё {1500 - this.state.user.balance})</p>
			}
			<div className="contentPage">
				{
					cookie.load("token") !== undefined && cookie.load("token") !== null
						? <form className={this.state.empty ? "error border" : "border"}>
							<label>Заголовок</label>
							<input type="text" name="title" onChange={this.handleTitle}/>
							<label>Краткое описание</label>
							<textarea onChange={this.handleDesc}/>
							<label>Содержание</label>
							<textarea onChange={this.handleText}/>
							<label>Категория проекта</label>
							<select onChange={this.handleCategory}>
								<option value="invention" selected={true}>Изобретение</option>
								<option value="it">IT продукт</option>
								<option value="demand">Спрос</option>
								<option value="business">Готовый бизнес</option>
								<option value="transport">Транспорт</option>
								<option value="home">Недвижимость/Земельные участки</option>
								<option value="production">Производство</option>
								<option value="consumerElectronics">Бытовая электроника</option>
								<option value="hobby">Хобби и отдых</option>
								<option value="offer">Предложение готовых продуктов</option>
								<option value="building">Cтроительство</option>
								<option value="startup">Стартапы</option>
								<option value="art">Исскуство</option>
								<option value="kids">Детские проеты</option>
								<option value="other">Другое</option>
							</select>
							{
								this.state.category === "demand"
									? <div>
										<label>Спрос</label>
										<textarea onChange={this.handleTextPlus}/>
									</div>
									: null
							}
							{
								this.state.category !== "demand"
									? <div>
										<label>Предложение</label>
										<textarea onChange={this.handleTextPlus}/>
									</div>
									: null
							}
							<label>Номер телефона</label>
							<input type="text" name="phone" onChange={this.handlePhone}/>
							<label>EMail</label>
							<input type="email" onChange={this.handleEmail}/>
							<label>Ключевые слова (через запятую)</label>
							<input type="text" name="tags" onChange={this.handleTags}/>
							<label>Фото (не обязательно)</label>
							<input type="file" ref={ref => {
								this.uploadFile = ref;
							}} onChange={this.uploadImg}/>
							<div className="buttons">
								<button type="button" onClick={this.addProject}>Создать</button>
							</div>
							{
								this.state.empty
									? <p>Не все поля заполнены</p>
									: null
							}
							{
								this.state.response === "LOADING"
									? <p>Загрузка...</p>
									: null
							}
							{
								this.state.response === "PROJECT_ADD"
									? <Redirect to="/projects"/>
									: null
							}
						</form>
						: <Redirect to="/projects"/>
				}
			</div>
		</div>
	}
}

export default ProjectAdd;
