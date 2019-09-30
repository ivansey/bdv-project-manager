import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link} from "react-router-dom";

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: "LOADING",
			user: {},
			openMenu: false
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.changeStatusMenu = this.changeStatusMenu.bind(this);
		
		this.checkToken();
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then((data) => {
			this.setState({user: data.data.data, response: "DONE"});
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
	
	changeStatusMenu = () => {
		if (this.state.openMenu === false) {
			this.setState({openMenu: true});
			console.log("open");
		} else {
			this.setState({openMenu: false});
			console.log("close");
		}
	};
	
	// render() {
	// 	return <div className="header">
	// 		<div className="menu">
	// 			{
	// 				(cookie.load('token') === null || cookie.load('token') === undefined)
	// 					? <Link to="/login">Вход</Link>
	// 					: null
	// 			}
	// 			{
	// 				(cookie.load('token') === null || cookie.load('token') === undefined)
	// 					? <Link to="/reg">Регистрация</Link>
	// 					: null
	// 			}
	// 			{
	// 				cookie.load('token') !== null && cookie.load('token') !== undefined && this.state.response !== "LOADING"
	// 					? <Link
	// 						to={`/user/cabinet`}>{this.state.user.firstName + " " + this.state.user.lastName} {this.state.user.balance + " RUB"}</Link>
	// 					: null
	// 			}
	// 			{
	// 				this.state.response === "LOADING"
	// 					? <p>Загрузка...</p>
	// 					: null
	// 			}
	// 		</div>
	// 		<div className="text">
	// 			<h1 className="title">BDV</h1>
	// 			<h2 className="subtitle">Бизнес Действуя Вместе</h2>
	// 		</div>
	// 		<div className="menu border">
	// 			<Link to="/">Главная</Link>
	// 			<Link to="/projects" className="top">Ваш старт</Link>
	// 			{
	// 				cookie.load('token') !== null && cookie.load('token') !== undefined
	// 					? <Link to="/cases">Кейсы</Link>
	// 					: null
	// 			}
	// 			<Link to="/about">О нас</Link>
	// 			<Link to="/contacts">Контакты</Link>
	// 		</div>
	// 	</div>
	// }
	
	render() {
		return <div>
			<div className="header">
				<div className="left">
					<span className="mdi mdi-menu" onClick={this.changeStatusMenu}/>
					<p className="title">BDV</p>
				</div>
				<div className="right">
					<span className="mdi mdi-magnify"/>
				</div>
			</div>
			<div className={this.state.openMenu === false ? "menu" : "menu open"}>
				<div className="user">
					<span className="mdi mdi-account"/>
					<p>User Name</p>
					<p>Balance</p>
				</div>
				<Link>Главная</Link>
				<Link>Проекты</Link>
				{
					cookie.load('token') !== null && cookie.load('token') !== undefined
						? <Link to="/cases">Кейсы</Link>
						: null
				}
				<Link>О нас</Link>
				<Link>Контакты</Link>
			</div>
		</div>
	}
}

export default Header;