/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */

import {async} from '@firebase/util';
import {PermPhoneMsg} from '@material-ui/icons';
import React, {useRef, useEffect} from 'react';
export default function Paypal(total) {
	useEffect(() => {
		console.log(total.total);
		window.paypal
			.Buttons({
				createOrder: (data, actions, err) => actions.order.create({
						intent: 'CAPTURE',
						purchase_units: [
							{
								description: 'Sketter promotion',
								amount: {
									currency_code: 'USD',
									value: total.total
								}
							}
						]
					}),
				onApprove: async (data, actions) => {
					const order = await actions.order.capture();
					console.log(order);
				},
				onError: (err) => {
					console.log(err);
				}
			})
			.render(paypal.current);
	}, []);
	const paypal = useRef();
	return <div ref={paypal} />;
}
