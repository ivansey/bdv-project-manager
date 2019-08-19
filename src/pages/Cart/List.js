import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";


class CasesList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cases: [],
			response: "LOADING",
			user: {},
			limit: 10,
			category: "",
			project: {}
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.getProjects = this.getProjects.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		
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
		axios.post('/api/v1/cart/list', {
			idUser: this.state.user._id
		}).then(data => {
			this.setState({response: data.data.response, cases: data.data.data});
		});
	};
	
	getProject = id => {
		axios.post('/api/v1/projects/get', {
			id: id
		}).then(data => {
			this.setState({project: data.data.data})
		});
	};
	
	render() {
		return <div className="page" id="cases">
			<h3 className="title">Кейсы</h3>
			{
				this.state.response === "LOADING"
					? <p>Загрузка...</p>
					: null
			}
			{
				this.state.response === "NOT_CART"
					? <p>Проекты отсутсвуют</p>
					: null
			}
			{
				this.state.cases.length > 0
					? <div className="contentPage">
						{
							this.state.cases.map(news => {
								let project = this.getProject(news.idProject);
								return <div className="panelContent">
									<p>Проект #{this.state.project.id} - {this.state.project.title}</p>
									<br/>
									<div>
										<p>Отправленные контакты:</p>
										<p>Телефон: {news.phone}</p>
										<p>EMail: {news.email}</p>
									</div>
								</div>
							})
						}
					</div>
					: null
			}
		</div>
	}
}

export default CasesList;