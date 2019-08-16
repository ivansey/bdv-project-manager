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
    }
}

export default Reg;
