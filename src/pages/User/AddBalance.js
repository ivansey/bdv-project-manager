import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";
import {checkMD5, buildResponse} from "node-yandex-kassa";

import PanelContent from "../../components/PanelContent";
import Popup from "reactjs-popup";

class AddBalance extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {}
	}
	
	render() {
		axios("https://payment.yandex.net/api/v3/payments", {
			"amount": {
				"value": "2.00",
				"currency": "RUB"
			},
			"confirmation": {
				"type": "embedded"
			},
			"capture": true,
			"description": "Заказ №72"
		}, {
			auth: {
				username: "630436",
				password: "live_n3aerljxIreTraZ-iTaOASQoGZDPDXUUof1ynmUIfjw"
			}
		}).then((res) => {
			console.log(res);
		});
		
		const checkout = new window.YandexCheckout({
			confirmation_token: 'live_n3aerljxIreTraZ-iTaOASQoGZDPDXUUof1ynmUIfjw',
			return_url: 'http://localhost:3000',
			error_callback(error) {
				//Обработка ошибок инициализации
			}
		});
		
		checkout.render('payment-form');
		
		return <div className="page" id="addBalance">
			<div id="payment-form"></div>
		</div>
	}
}

export default AddBalance;