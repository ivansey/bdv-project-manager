import React from 'react';
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";

class PanelContent extends React.Component {
	render() {
		return <div className="panelContent" key={this.props._id} id={`news-${this.props._id}`}>
			{
				this.props.img !== ""
					? <img src={this.props.img} alt={this.props.title}/>
					: null
			}
			<h4 className="title">{this.props.title}</h4>
			<p className="desc">{this.props.desc}</p>
			{
				!this.props.active && this.props.type === "projects/get"
					? <Popup trigger={<button>Читать далее...</button>} modal closeOnDocumentClick>
					    <div>Ваш аккаунт не активирован или вы не зарегистрированы.</div>
                        <div>
                            <Link to="/reg" className="button">Регистрация</Link>
                            <Link to="/login" className="button">Вход</Link>
                        </div>
					</Popup>
					: <Link to={`/${this.props.type}/${this.props._id}`} className="button" style={{display: 'block'}}>Читать
						далее...</Link>
			}
		</div>
	}
}

export default PanelContent;