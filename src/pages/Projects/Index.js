import React from 'react';
import axios from "axios";
import cookie from "react-cookies";
import {Redirect, Link} from 'react-router-dom';
import Popup from "reactjs-popup";

class ProjectGet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			project: {},
			response: "LOADING",
			user: {},
			category: "",
			email: "",
			phone: "",
			text: "",
			responseAddLevel: ""
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.getProject = this.getProject.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
		this.handleText = this.handleText.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.addLevelOne = this.addLevelOne.bind(this);
		
		this.checkToken();
		this.getProject();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then(data => {
			this.setState({user: data.data.data});
			console.log(data.data.data);
		});
	};
	
	checkToken = () => {
		if (cookie.load('token')) {
			axios.post('/api/v1/users/checkToken', {
				token: cookie.load('token'),
			}).then(data => {
				this.setState({idUser: data.data.id});
				this.getInfo();
			});
		}
	};
	
	getProject = () => {
		axios.post('/api/v1/projects/get', {
			id: this.props.match.params.id
		}).then(data => {
			this.setState({response: data.data.response, project: data.data.data});
			console.log(data.data.data);
		});
	};
	
	deleteProject = () => {
		axios.post('/api/v1/projects/delete', {
			id: this.props.match.params.id,
			token: cookie.load("token")
		}).then(data => {
			this.setState({response: data.data.response});
		});
	};
	
	handleEmail = e => {
		this.setState({email: e.target.value});
	};
	
	handlePhone = e => {
		this.setState({phone: e.target.value});
	};
	
	handleText = e => {
		this.setState({text: e.target.value});
	};
	
	addToCart = () => {
		axios.post("/api/v1/cart/add", {
			idUser: this.state.user._id,
			idProject: this.state.project._id,
			phone: this.state.phone,
			email: this.state.email,
			text: this.state.text,
			token: cookie.load("token")
		});
	};
	
	addLevelOne = () => {
		axios.post("/api/v1/projects/addLevel", {
			idUser: this.state.user._id,
			id: this.state.project._id,
			level: 1,
			token: cookie.load("token")
		}).then(data => {
			this.setState({responseAddLevel: data.data.response});
		});
	};
	
	render() {
		return <div>
			{
				this.state.user.active === true
					? <div className="page">
						{
							this.state.response === "LOADING"
								? <p>Загрузка...</p>
								: null
						}
						{
							this.state.response === "NOT_PROJECT"
								? <p>Проект отсутсвует</p>
								: null
						}
						{
							this.state.response === "PROJECT_FOUND"
								? <div className="contentPage news" id={`project-${this.state.project._id}`}>
									{
										this.state.project.img !== ""
											? <img src={this.state.project.img} alt={this.state.project.title}/>
											: null
									}
									{
										this.state.user.type === "admin"
											? <div><a href={"#"} onClick={this.deleteProject}>Удалить</a></div>
											: null
									}
									{
										this.state.project.idUser === this.state.user._id
											? <form className="border">
												<p>Не хотите ли продвинуть в топ свой проект? Вы будете в первых списках проектов, и всего за 5000 RUB</p>
												{
													this.state.user.balance >= 5000
														? <p>У вас на счету {this.state.user.balance} RUB</p>
														: <p>У вас  недостаточно средств на счету (необходимо ещё {5000 - this.state.user.balance} RUB)</p>
												}
												<p>Для покупки необходимо 5000 RUB</p>
												<div>
													<button onClick={this.addLevelOne}>Приобрести</button>
												</div>
											</form>
											: null
									}
									<p className="time">{this.state.project.time} {this.state.project.idUser === this.state.user._id ? [<Link to={"/projects/edit/" + this.state.project._id}>Редактировать</Link>] : null}</p>
									<h2 className="title">Проект #{this.state.project.id} - {this.state.project.title}</h2>
									<div className="text">{this.state.project.text}</div>
									<br/><br/>
									<p>Требование/Предложение: </p>
									<div className="text">{this.state.project.textPlus}</div>
									<br/>
									<p>Ключевые слова</p>
									<div className="text">{this.state.project.tags}</div>
									<br/><br/>
									{
										this.state.user.type === "admin"
											? <form className="border">
												<p>Телефон: {this.state.project.phone}</p>
												<p>EMail: {this.state.project.email}</p>
											</form>
											: null
									}
									<br/>
									<form className="border">
										<p>Добавить в кейс</p>
										<br/>
										<label>Телефон</label>
										<input type="text" onChange={this.handlePhone}/>
										<label>EMail</label>
										<input type="email" onChange={this.handleEmail}/>
										<label>Примечание</label>
										<input type="text" onChange={this.handleText}/> <br/>
										<button type="button" onClick={this.addToCart}>Добавить в кейс</button>
									</form>
								</div>
								: null
						}
						{
							this.state.response === "PROJECT_DELETED"
								? <Redirect to="/projects"/>
								: null
						}
					</div>
					: <p>Для того, чтобы увидеть этот проект, зарегистрируйтесь и активируйте свой аккаунт</p>
			}
		</div>
	}
}

export default ProjectGet;