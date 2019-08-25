import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from "react-router-dom";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: "",
			user: {}
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		
		this.checkToken();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then((data) => {
			this.setState({user: data.data.data});
		});
	};
	
	checkToken = () => {
		if (cookie.load('token')) {
			axios.post('/api/v1/users/checkToken', {
				token: cookie.load('token'),
			}).then((data) => {
				this.setState({idUser: data.data.id});
				this.getInfo();
			});
		}
	};
	
	render() {
		return <div className="header">
			<div className="menu">
				{
					cookie.load('token') === null || cookie.load('token') === undefined
						? <Link to="/login">Вход</Link>
						: null
				}
				{
					cookie.load('token') === null || cookie.load('token') === undefined
						? <Link to="/reg">Регистрация</Link>
						: null
				}
				{
					cookie.load('token') !== null && cookie.load('token') !== undefined
						? <Link
							to={`/user/cabinet`}>{this.state.user.firstName + " " + this.state.user.lastName} {this.state.user.balance + " RUB"}</Link>
						: null
				}
			</div>
			<div className="text">
				<h1 className="title">BDV</h1>
				<h2 className="subtitle">Бизнес Действуя Вместе</h2>
			</div>
			<div className="menu border">
				<Link to="/">Главная</Link>
				<Link to="/projects" className="top">Ваш старт</Link>
				{
					cookie.load('token') !== null && cookie.load('token') !== undefined
						? <Link to="/cases">Кейсы</Link>
						: null
				}
				<Link to="/about">О нас</Link>
				<Link to="/contacts">Контакты</Link>
			</div>
		</div>
	}
}

export default Header;