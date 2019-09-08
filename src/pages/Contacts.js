import React from 'react';

class Contacts extends React.Component {
	render() {
		return <div className="page" id="about">
			<h3 className="title">Контакты</h3>
			<div className="text">
				<p><a href="https://instagram.com/biznesdeystvuy" target="_blank">Instagram</a></p>
				<p><a href="https://vk.com/club180296637">ВКонтакте</a></p>
				<p><a href="tel://+79994012670">Телефон +79994012670</a></p>
				<p><a href="mailto://bdvcool@yandex.ru">EMail</a></p>
			</div>
		</div>
	}
}

export default Contacts;