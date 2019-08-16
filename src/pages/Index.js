import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

import PanelContent from "../components/PanelContent";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: {},
            response: "LOADING",
            user: {},
            limit: 10
        };

        this.checkToken = this.checkToken.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getNews = this.getNews.bind(this);

        this.checkToken();
        this.getNews();
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

    getNews = () => {
        axios.post('/api/v1/news/list', {
            limit: this.state.limit
        }).then((data) => {
            console.log(data.data);
            this.setState({response: data.data.response ,news: data.data.data});
        });
    };

    render() {
        return <div className="page" id="index">
            <h3 className="title">Новости</h3>
            {
                this.state.user.type === "admin"
                    ? <Link to="/news/add">Добавить новость</Link>
                    : null
            }
            {
                this.state.response === "LOADING"
                    ? <p>Загрузка...</p>
                    : null
            }
            {
                this.state.response === "NOT_NEWS"
                    ? <p>Новости отсутсвуют</p>
                    : null
            }
            {
                this.state.news.length > 0
                    ? <div className="contentPage">
                        {
                            this.state.news.map(news => {
                                return <PanelContent _id={news._id} title={news.title} desc={news.desc} img={news.img} type="news"/>
                            })
                        }
                    </div>
                    : null
            }
        </div>
    }
}

export default Index;