import React from 'react';
import axios from "axios";
import cookie from "react-cookies";
import {Redirect} from 'react-router-dom';

class NewsIndex extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			news: {},
			response: "LOADING",
			user: {},
			commentText: "",
			comments: []
		};
		
		this.checkToken = this.checkToken.bind(this);
		this.getInfo = this.getInfo.bind(this);
		this.getNews = this.getNews.bind(this);
		this.getLikes = this.getLikes.bind(this);
		this.addLike = this.addLike.bind(this);
		this.getComments = this.getComments.bind(this);
		this.addComment = this.addComment.bind(this);
		this.handleText = this.handleText.bind(this);
		this.getName = this.getName.bind(this);
		this.deleteNews = this.deleteNews.bind(this);
		
		this.checkToken();
		this.getNews();
		
		this.getName = function (id) {
			axios.post('/api/v1/users/get', {
				idUser: id
			}).then(data => {
				return data.data.data.firstName
			});
		}
	}
	
	getInfo = () => {
		axios.post('/api/v1/users/get', {
			idUser: this.state.idUser
		}).then(data => {
			this.setState({user: data.data.data});
		});
	};
	
	getName = id => {
		axios.post('/api/v1/users/get', {
			idUser: id
		}).then(data => {
			return data.data.data.firstName
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
	
	getNews = () => {
		axios.post('/api/v1/news/get', {
			id: this.props.match.params.id
		}).then(data => {
			this.setState({response: data.data.response, news: data.data.data[0]});
			this.getLikes();
			this.getComments();
		});
	};
	
	getLikes = () => {
		axios.post('/api/v1/news/getLikes', {
			id: this.props.match.params.id
		}).then(data => {
			this.setState({responseLike: data.data.response, likes: data.data.data});
		});
	};
	
	addLike = () => {
		axios.post('/api/v1/news/addLike', {
			id: this.props.match.params.id,
			idUser: this.state.user._id
		}).then(data => {
			this.setState({responseLikeAdd: data.data.response});
			this.getLikes();
		});
	};
	
	getComments = () => {
		axios.post('/api/v1/news/getComments', {
			id: this.props.match.params.id
		}).then(data => {
			this.setState({responseComment: data.data.response, comments: data.data.data});
		});
	};
	
	addComment = () => {
		axios.post('/api/v1/news/addComment', {
			id: this.props.match.params.id,
			idUser: this.state.user._id,
			text: this.state.commentText
		}).then(data => {
			this.setState({responseCommentAdd: data.data.response});
			this.getComments();
		});
	};
	
	handleText = e => {
		this.setState({commentText: e.target.value});
	};
	
	deleteNews = () => {
		axios.post('/api/v1/news/delete', {
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
				this.state.response === "NOT_NEWS"
					? <p>Новость отсутсвует</p>
					: null
			}
			{
				this.state.response === "NEWS_FOUND"
					? <div className="contentPage news" id={`news-${this.state.news._id}`}>
						{
							this.state.news.img !== ""
								? <img src={this.state.news.img} alt={this.state.news.title}/>
								: null
						}
						{
							this.state.user.type === "admin"
								? <div><a href={"#del"} onClick={this.deleteNews}>Удалить</a></div>
								: null
						}
						<p className="time">{this.state.news.time}</p>
						<h2 className="title">{this.state.news.title}</h2>
						<div className="text">{this.state.news.text}</div>
						<button onClick={this.addLike} className="likes">Like: {this.state.likes}</button>
						<br/>
						<h4>Коментарии</h4>
						{
							this.state.comments.length !== 0
								? <div className="comments">
									{
										this.state.comments.map(arr => {
											return <div className="comment" key={arr._id}>
												<p className="title">{arr.firstName}</p>
												<p>{arr.text}</p>
											</div>
										})
									}
								</div>
								: <p>Коментраиев нет</p>
						}
						{
							cookie.load("token") !== null || cookie.load("token") !== undefined || this.state.user.active === false
								? <div className="addComment">
									<textarea cols="30" rows="3" onChange={this.handleText}/>
									<button onClick={this.addComment}>Добавить</button>
								</div>
								: <p>Только пользователи могу ставить коментарии</p>
						}
					</div>
					: null
			}
			{
				this.state.response === "NEWS_DELETED"
					? <Redirect to="/"/>
					: null
			}
		</div>
	}
}

export default NewsIndex;