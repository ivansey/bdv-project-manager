import React from 'react';
import axios from "axios";
import cookie from "react-cookies";
import {Redirect} from 'react-router-dom';

class ProjectGet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            response: "LOADING",
            user: {},
            category: ""
        };

        this.checkToken = this.checkToken.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.getProject = this.getProject.bind(this);
        this.deleteProject = this.deleteProject.bind(this);


        this.checkToken();
        this.getProject();
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

    getProject = () => {
        axios.post('/api/v1/projects/get', {
            id: this.props.match.params.id
        }).then(data => {
            this.setState({response: data.data.response, project: data.data.data});
        });
    };

    deleteProject = () => {
        axios.post('/api/v1/projects/delete', {
            id: this.props.match.params.id,
            token: cookie.load("token")
        }).then(data => {
            this.setState({response: data.data.response});
        });
    };

    render() {
        return <div className="page">
            {
                this.state.response === "LOADING"
                    ? <p>Загрузка...</p>
                    : null
            }
            {
                this.state.response === "NOT_PROJECT"
                    ? <p>Проект отсутсвует</p>
                    : null
            }
            {
                this.state.response === "PROJECT_FOUND"
                    ? <div className="contentPage news" id={`project-${this.state.project._id}`}>
                        {
                            this.state.project.img !== ""
                                ? <img src={this.state.project.img} alt={this.state.project.title}/>
                                : null
                        }
                        {
                            this.state.user.type === "admin"
                                ? <div><a href="#" onClick={this.deleteProject}>Удалить</a></div>
                                : null
                        }
                        <p className="time">{this.state.project.time}</p>
                        <h2 className="title">{this.state.project.title}</h2>
                        <div className="text">{this.state.project.text}</div>
                    </div>
                    : null
            }
            {
                this.state.response === "PROJECT_DELETED"
                    ? <Redirect to="/projects"/>
                    : null
            }
        </div>
    }
}

export default ProjectGet;