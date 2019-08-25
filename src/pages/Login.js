import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Link, Redirect} from "react-router-dom";

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: "",
			token: null,
			email: "",
			pass: "",
			empty: false
		};
		
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePass = this.handlePass.bind(this);
		this.send = this.send.bind(this);
		this.turnOffError = this.turnOffError.bind(this);
		this.checkFields = this.checkFields.bind(this);
	}
	
	handleEmail = (e) => {
		this.setState({email: e.target.value});
		this.turnOffError();
	};
	
	handlePass = (e) => {
		this.setState({pass: e.target.value});
		this.turnOffError();
	};
	
	send = () => {
		if (this.checkFields()) {
			axios.post('/api/v1/users/login', {
				email: this.state.email,
				pass: this.state.pass
			}).then((data) => {
				this.setState({response: data.data.response});
				console.log(this.state.response);
				if (this.state.response !== "NOT_USER" && this.state.response !== "INVALID_PASSWORD" && data.data.token !== null) {
					cookie.save('token', data.data.token, {maxAge: 60 * 60 * 24 * 7, path: "/"});
				}
			});
		}
	};
	
	checkFields = () => {
		if (this.state.email === "" || this.state.pass === "" || this.state.firstName === "" || this.state.lastName === "") {
			this.setState({empty: true});
			return false;
		}
		return true;
	};
	
	turnOffError = () => {
		this.setState({empty: false});
	};
	
	render() {
		return <div className="page" id="login">
			<h3 className="title">Вход в сервис</h3>
			<form className={this.state.empty ? "error border" : "border"}>
				<label>EMail</label>
				<input type="email" placeholder="EMail" onChange={this.handleEmail}/>
				<br/>
				<label>Пароль</label>
				<input type="password" placeholder="Пароль" onChange={this.handlePass}/>
				<br/>
				<div className="buttons">
					<button className="button" type="button" onClick={this.send}>Вход</button>
				</div>
				{
					this.state.empty
						? <p>Не все поля заполнены</p>
						: null
				}
				{
					this.state.response === "NOT_USER"
						? <p>Нет такого пользователя, <Link to="/reg">зарегистрируйтесь</Link></p>
						: null
				}
				{
					this.state.response === "INVALID_PASSWORD"
						? <p>Неверный пароль</p>
						: null
				}
				{
					this.state.response === "USER_LOGIN"
						? <Redirect to="/"/>
						: null
				}
			</form>
		</div>
	}
}

export default Login;
