import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

import PanelContent from "../../components/PanelContent";
import Popup from "reactjs-popup";

class ProjectList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			response: "LOADING",
			user: {},
			limit: 10,
			category: "all"
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.getProjects = this.getProjects.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.addLimit = this.addLimit.bind(this);
		
		this.checkToken();
		this.getProjects();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then(data => {
			this.setState({user: data.data.data});
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
	
	handleCategory = (e) => {
		this.setState({category: e.target.value});
		this.getProjects();
	};
	
	getProjects = () => {
		axios.post('/api/v1/projects/list', {
			limit: this.state.limit,
			category: this.state.category
		}).then(data => {
			this.setState({response: data.data.response, projects: data.data.data});
		});
	};
	
	addLimit = () => {
		this.setState({limit: this.state.limit + 10});
		this.getProjects();
	};
	
	render() {
		return <div className="page" id="index">
			<h3 className="title">Ваш старт</h3>
			{
				cookie.load("token") === null || cookie.load("token") === undefined || this.state.active === false
					? <Popup trigger={<button>Добавить проект</button>} modal closeOnDocumentClick>
						<div>Ваш аккаунт не активирован или вы не зарегистрированы.</div>
						<div>
							<Link to="/reg" className="button">Регистрация</Link>
							<Link to="/login" className="button">Вход</Link>
						</div>
					</Popup>
					: <Link to="/projects/add" сlassName="button">Добавить проект</Link>
			}
			{
				this.state.response === "LOADING"
					? <p>Загрузка...</p>
					: null
			}
			{
				this.state.response === "NOT_PROJECTS"
					? <p>Проекты отсутсвуют</p>
					: null
			}
			{
				this.state.projects.length > 0
					? <div className="contentPage">
						<div className="panelContent center">
							<label>Категория проекта</label>
							<select onChange={this.handleCategory} onClick={this.getProjects}>
								<option value="all" selected={true}>Без категории</option>
								<option value="invention">Изобретение</option>
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
								<option value="other">Другое</option>
							</select>
						</div>
						<br/>
						<br/>
						{
							this.state.projects.map(news => {
								return <PanelContent active={this.state.user.active} _id={news._id} title={`Проект #${news.id} - ${news.title}`} desc={news.desc} img={news.img} type="projects/get"/>
							})
						}
					</div>
					: null
			}
			<br/><br/>
			{
				this.state.projects.length === this.state.limit
					? <button onClick={this.addLimit}>Ещё проекты</button>
					: null
			}
		</div>
	}
}

export default ProjectList;