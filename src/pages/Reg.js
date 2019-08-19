import React from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";

class Reg extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			response: "",
			empty: false,
			email: "",
			pass: "",
			firstName: "",
			lastName: ""
		};
		
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePass = this.handlePass.bind(this);
		this.handleFirstName = this.handleFirstName.bind(this);
		this.handleLastName = this.handleLastName.bind(this);
		this.checkFields = this.checkFields.bind(this);
		this.turnOffError = this.turnOffError.bind(this);
		this.send = this.send.bind(this);
	}
	
	handleEmail = (e) => {
		this.setState({email: e.target.value});
		this.turnOffError();
	};
	
	handlePass = (e) => {
		this.setState({pass: e.target.value});
		this.turnOffError();
	};
	
	handleFirstName = (e) => {
		this.setState({firstName: e.target.value});
		this.turnOffError();
	};
	
	handleLastName = (e) => {
		this.setState({lastName: e.target.value});
		this.turnOffError();
	};
	
	checkFields = () => {
		if (this.state.email === "" || this.state.pass === "" || this.state.firstName === "" || this.state.lastName === "") {
			this.setState({empty: true});
			return false;
		}
		return true;
	};
	
	send = () => {
		if (this.checkFields() === true) {
			axios.post('/api/v1/users/reg', {
				email: this.state.email,
				pass: this.state.pass,
				firstName: this.state.firstName,
				lastName: this.state.lastName
			}).then((data) => {
				this.setState({response: "LOADING"});
				this.setState({response: data.data.response});
			});
		}
	};
	
	turnOffError = () => {
		this.setState({empty: false});
	};
	
	render() {
		return <div className="page" id="reg">
			<h3 className="title">Регистрация в сервисе</h3>
			<div className="flex columns">
				<div className="column">
					<form className="border">
						<b>Какие возможности вы получаете после регистрации на нашем сайте вашего проекта?</b><br/>
						В разделе ваш старт
						ваш проект приступает к шагам его реализации, мы изучаем возможности, принимаем к сведенью ваши
						пожелания, даем наши рекомендации. <br/><br/>
						Второе ваш проект готов к исполнению следующих действий: Если
						он
						нуждается в инвестиции, то мы отправляем инвесторам информацию о новом вашем проекте если же ваш
						проект требует поиска новых партнеров, то мы самостоятельно подбираем вам партнеров. Если ваш
						проект
						включает в себя индивидуальный вид деятельности связанный с грузоперевозками, арендой техники,
						сдачей, продажей, недвижемого и движемых объектов, на постоянной основе то в рамках наших
						проектов
						мы находим вам как партнеров так и варианты потребности в вашем виде деятельности на территории
						других регионах. Если ваш проект это ваше изобретение, которое вы регестрировали, либо
						собираетесь
						зарегестрировать, то мы пошагово вам поможем это сделать. Если вы занимаетесь торговлей и
						продоете
						оптом, либо у вас есть потребность в оптовых закупках на индивидуальных условиях, то мы подберем
						вам
						предложение все что от вас требуется это сделать первый шаг к вашему старту!
						<br/>
						<br/>
						Также имеются партнеры за рубежом и инвесторы, которые будут рады рассмотреть ваш проект!
					</form>
				</div>
				<div className="column">
					<form className={this.state.empty ? "error border" : "border"}>
						<label>EMail</label>
						<input type="email" placeholder="EMail" name="email"
						       onChange={this.handleEmail}/>
						<br/>
						<label>Пароль</label>
						<input type="password" placeholder="Пароль"
						       name="password" onChange={this.handlePass}/>
						<br/>
						<label>Имя</label>
						<input type="text" placeholder="Имя"
						       name="firstName" onChange={this.handleFirstName}/>
						<br/>
						<label>Фамилия</label>
						<input type="text" placeholder="Фамилия"
						       name="lastName" onChange={this.handleLastName}/>
						<br/>
						<div className="buttons">
							<button className="button" type="button" onClick={this.send}>Регистрация</button>
						</div>
						{
							this.state.empty
								? <p>Не все поля заполнены</p>
								: null
						}
						{
							this.state.response === "LOADING" && !this.state.empty
								? <p>Загрузка...</p>
								: null
						}
						{
							this.state.response === "EMAIL_NOT_FREE" && !this.state.empty
								? <p>Пользователь с таким EMail е зарегистрирован</p>
								: null
						}
						{
							this.state.response === "USER_ADD" && !this.state.empty
								? <Redirect to="/login"/>
								: null
						}
					</form>
				</div>
			</div>
		</div>
	}
}

export default Reg;
