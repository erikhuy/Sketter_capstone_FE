import {sign, verify} from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import {ACCESS_TOKEN_KEY} from 'shared/constants';
import axiosInstance from './axios';

const isValidToken = (accessToken) => {
	if (!accessToken) {
		console.log('false');
		return false;
	}

	const decoded = jwtDecode(accessToken);
	const currentTime = Date.now() / 1000;
	if (decoded.exp > currentTime) {
		console.log('false');
	}
	return decoded.exp > currentTime;
};

export const clearSession = () => {
	window.localStorage.removeItem('token');
	delete axiosInstance.defaults.headers.common.Authorization;
};

// const handleTokenExpired = (exp) => {
// 	let expiredTimer;
// 	window.clearTimeout(expiredTimer);
// 	const currentTime = Date.now();
// 	const timeLeft = exp * 1000 - currentTime;
// 	return window.setTimeout(() => {
// 		clearSession();
// 	}, timeLeft);
// };

const setSession = (accessToken) => {
	console.log(accessToken);
	if (accessToken) {
		// localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
		window.localStorage.setItem('token', accessToken);
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		// This function below will handle when token is expired
		// const {exp} = jwtDecode(accessToken);
		// return handleTokenExpired(exp);
	}

	// return clearSession;
};

export {isValidToken, setSession, verify, sign};
