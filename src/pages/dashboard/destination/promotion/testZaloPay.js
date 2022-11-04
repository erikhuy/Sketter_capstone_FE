/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable prefer-template */
import axios from 'axios';
import CryptoJs from 'crypto-js';
import {v1 as uuid} from 'uuid';
import moment from 'moment/moment';
import {useCallback, useState} from 'react';
import {Button} from '@material-ui/core';

export default function TestZaloPay() {
	const config = {
		app_id: '2553',
		key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
		key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
		endpoint: 'https://sb-openapi.zalopay.vn/v2/create'
	};

	const embed_data = {};

	const items = [{}];
	const transID = Math.floor(Math.random() * 1000000);
	const order = {
		app_id: config.app_id,
		app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
		app_user: 'user123',
		app_time: Date.now(), // miliseconds
		item: JSON.stringify(items),
		embed_data: JSON.stringify(embed_data),
		amount: 50000,
		description: `Lazada - Payment for the order #${transID}`,
		bank_code: 'zalopayapp'
	};

	// appid|app_trans_id|appuser|amount|apptime|embeddata|item
	const data =
		config.app_id +
		'|' +
		order.app_trans_id +
		'|' +
		order.app_user +
		'|' +
		order.amount +
		'|' +
		order.app_time +
		'|' +
		order.embed_data +
		'|' +
		order.item;
	order.mac = CryptoJs.HmacSHA256(data, config.key1).toString();

	axios
		.post(config.endpoint, null, {params: order})
		.then((res) => {
			console.log(res.data);
		})
		.catch((err) => console.log(err));

	// return (
	// 	<>
	// 		<Button onClick={() => createOrder(order, config)}>Thanh toán</Button>
	// 	</>
	// );
}