import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect, Link} from 'react-router-dom';

class ProjectEdit extends React.Component {
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
			category: "invention",
			project: {}
		};
		
		this.getInfo = this.getInfo.bind(this);
		this.checkToken = this.checkToken.bind(this);
		this.getProject = this.getProject.bind(this);
		this.editProject = this.editProject.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		
		this.handleTitle = this.handleTitle.bind(this);
		this.handleText = this.handleText.bind(this);
		this.handleDesc = this.handleDesc.bind(this);
		
		this.checkFields = this.checkFields.bind(this);
		this.turnOffError = this.turnOffError.bind(this);
		
		this.checkToken();
		this.getProject();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then(data => {
			this.setState({user: data.data.data});
		});
	};
	
	editProject = () => {
		if (this.state.user.id !== "") {
			if (this.checkFields) {
				axios.post('/api/v1/projects/edit', {
					title: this.state.title,
					text: this.state.text,
					desc: this.state.desc,
					textPlus: this.state.textPlus,
					phone: this.state.phone,
					email: this.state.email,
					category: this.state.category,
					id: this.state.project._id
				}).then(data => {
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
			}).then(data => {
				if (data.data.response !== "NOT_TOKEN") {
					this.setState({idUser: data.data.id, status: "USER"});
					this.getInfo();
				}
			});
		}
	};
	
	getProject = () => {
		axios.post('/api/v1/projects/get', {
			id: this.props.match.params.id
		}).then(data => {
			this.setState({
				response: data.data.response,
				project: data.data.data,
				title: data.data.data.title,
				desc: data.data.data.desc,
				text: data.data.data.text,
				textPlus: data.data.data.textPlus,
				phone: data.data.data.phone,
				email: data.data.data.email
			});
		});
	};
	
	handleTitle = (e) => {
		this.setState({title: e.target.value});
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
			<br/>
			<div className="contentPage">
				{
					(cookie.load("token") !== undefined || cookie.load("token") !== null) && this.state.project.title !== undefined
						? <form className={this.state.empty ? "error border" : "border"}>
							<label>Заголовок</label>
							<input type="text" name="title" onChange={this.handleTitle}
							       defaultValue={this.state.project.title}/>
							<label>Краткое описание</label>
							<textarea onChange={this.handleDesc} defaultValue={this.state.project.desc}/>
							<label>Содержание</label>
							<textarea onChange={this.handleText} defaultValue={this.state.project.text}/>
							<label>Категория проекта</label>
							<select onChange={this.handleCategory}>
								<option value="invention"
								        selected={"invention" === this.state.project.category}>Изобретение
								</option>
								<option value="it" selected={"it" === this.state.project.category}>IT продукт</option>
								<option value="demand" selected={"demand" === this.state.project.category}>Спрос</option>
								<option value="business" selected={"business" === this.state.project.category}>Готовый
									бизнес
								</option>
								<option value="transport" selected={"transport" === this.state.project.category}>Транспорт
								</option>
								<option value="home"
								        selected={"home" === this.state.project.category}>Недвижимость/Земельные участки
								</option>
								<option value="production"
								        selected={"production" === this.state.project.category}>Производство
								</option>
								<option value="consumerElectronics"
								        selected={"consumerElectronics" === this.state.project.category}>Бытовая электроника
								</option>
								<option value="hobby" selected={"hobby" === this.state.project.category}>Хобби и отдых
								</option>
								<option value="offer" selected={"offer" === this.state.project.category}>Предложение готовых
									продуктов
								</option>
								<option value="building"
								        selected={"building" === this.state.project.category}>Cтроительство
								</option>
								<option value="startup" selected={"startup" === this.state.project.category}>Стартапы
								</option>
								<option value="art" selected={"art" === this.state.project.category}>Исскуство</option>
								<option value="kids" selected={"kids" === this.state.project.category}>Детские проеты
								</option>
								<option value="other" selected={"other" === this.state.project.category}>Другое</option>
							</select>
							{
								this.state.category === "demand"
									? <div>
										<label>Спрос</label>
										<textarea onChange={this.handleTextPlus} defaultValue={this.state.project.ttextPlus}/>
									</div>
									: null
							}
							{
								this.state.category !== "demand"
									? <div>
										<label>Предложение</label>
										<textarea onChange={this.handleTextPlus} defaultValue={this.state.project.textPlus}/>
									</div>
									: null
							}
							<label>Номер телефона</label>
							<input type="text" name="phone" onChange={this.handlePhone}
							       defaultValue={this.state.project.phone}/>
							<label>EMail</label>
							<input type="email" onChange={this.handleEmail} defaultValue={this.state.project.email}/>
							{/*<label>Фото (не обязательно)</label>*/}
							{/*<input type="file" ref={ref => {*/}
							{/*	this.uploadFile = ref;*/}
							{/*}} onChange={this.uploadImg}/>*/}
							<div className="buttons">
								<button type="button" onClick={this.editProject}>Редактировать</button>
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
								this.state.response === "EDITED"
									? <Redirect to={"/projects/get/" + this.state.project._id}/>
									: null
							}
						</form>
						: null
				}
			</div>
		</div>
	}
}

export default ProjectEdit;
