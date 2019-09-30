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
		this.addLimit = this.addLimit.bind(this);
		
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
			this.setState({response: data.data.response, news: data.data.data});
		});
	};
	
	addLimit = () => {
		this.setState({limit: this.state.limit + 10});
		this.getNews();
	};
	
	render() {
		return <div className="page" id="index">
			<div className="text">
				<h3>Приветствуем вас на нашем сайте!</h3><br/>
				Здесь вы можете найти для себя много нового - начиная от того как
				работает действующий бизнес, и как начинают работать проекты. Так же как реализовать свой проект с нуля.
				У нас много полезного связанного с бизнесом. Так же, мы покажем как не попаться на какие курсы лучше не
				ходить, как выявить недобросовесного клиента здесь мы найдем сами вашему проекту инвестора либо
				напарника с похожим делом или потребностью. Также в нашей команде имеются специалисты, которые с
				радостью помогут решить важную задачу вашему бизнесу. <br/><br/>
				<b>Ваш проект важен</b> если вы этого хотите, то мы
				поможем вам с преодолением многих трудностей и помни не слушай тех, кто говорит не получится, это
				ложь!<br/><br/>
				<b>Сделав шаг навстречу мечте какой бы она не казалась!</b>
			</div>
			<br/>
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
								return <PanelContent _id={news._id} title={news.title} desc={news.desc} img={news.img}
								                     type="news"/>
							})
						}
					</div>
					: null
			}
			<br/><br/>
			{
				this.state.news.length === this.state.limit
					? <button onClick={this.addLimit}>Ещё новости</button>
					: null
			}
			
		</div>
	}
}

export default Index;