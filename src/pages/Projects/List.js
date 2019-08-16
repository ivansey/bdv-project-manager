import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

import PanelContent from "../../components/PanelContent";

class ProjectList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            response: "LOADING",
            user: {},
            limit: 10,
            category: ""
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
        axios.post('/api/v1/projects/list', {
            limit: this.state.limit,
            category: this.state.category
        }).then(data => {
            this.setState({response: data.data.response, projects: data.data.data});
        });
    };

    render() {
        return <div className="page" id="index">
            <h3 className="title">Ваш старт</h3>
            <Link to="/projects/add">Добавить проект</Link>
            <label>Категория проекта</label>
            <select onChange={this.handleCategory} onClick={this.getProjects}>
                <option value="" selected={true}>Без категории</option>
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
                <option value="other">Другое</option>
            </select>
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
                        {
                            this.state.projects.map(news => {
                                return <PanelContent _id={news._id} title={news.title} desc={news.desc} img={news.img} type="projects/get"/>
                            })
                        }
                    </div>
                    : <p>Проекты отсутсвуют</p>
            }
        </div>
    }
}

export default ProjectList;