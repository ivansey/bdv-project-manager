import React from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect, Link} from 'react-router-dom';

class NewsAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: "",
            user: {},
            empty: false,
            title: "",
            text: "",
            desc: "",
            youtube: "",
        };

        this.getInfo = this.getInfo.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.addNews = this.addNews.bind(this);
        this.uploadImg = this.uploadImg.bind(this);

        this.handleTitle = this.handleTitle.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleDesc = this.handleDesc.bind(this);

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

    addNews = () => {
        if (this.state.user.id !== "") {
            if (this.checkFields) {
                axios.post('/api/v1/news/add', {
                    idUser: this.state.user._id,
                    title: this.state.title,
                    text: this.state.text,
                    desc: this.state.desc,
                    img: this.state.img
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

    handleText = (e) => {
        this.setState({text: e.target.value});
    };

    handleDesc = (e) => {
        this.setState({desc: e.target.value});
    };

    checkFields = () => {
        if (this.state.name === "") {
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
            <div className="contentPage">
                {
                    cookie.load("token") !== undefined && cookie.load("token") !== null
                        ? <form className={this.state.empty ? "error border" : "border"}>
                            <label>Заголовок</label>
                            <input type="text" name="nameHome" placeholder="Имя" onChange={this.handleTitle}/>
                            <label>Краткое описание</label>
                            <input type="text" name="address" placeholder="Адрес" onChange={this.handleText}/>
                            <label>Содержание</label>
                            <input type="text" name="desc" placeholder="Примечание" onChange={this.handleDesc}/>
                            <label>Фото (не обязательно)</label>
                            <input type="file" ref={ref => {this.uploadFile = ref;}} onChange={this.uploadImg}/>
                            <div className="buttons">
                                <button type="button" onClick={this.addNews}>Создать</button>
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
                                this.state.response === "NEWS_ADD"
                                    ? <Redirect to="/"/>
                                    : null
                            }
                        </form>
                        : <Redirect to="/"/>
                }
            </div>
        </div>
    }
}

export default NewsAdd;
