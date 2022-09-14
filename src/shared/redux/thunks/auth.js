import {Cookies, useCookies} from 'react-cookie';
import axiosInstance from 'utils/axios';
import {createAsyncThunkWithErrorHandler} from 'utils/createAsyncThunkWithErrorHandler';
import {setSession} from 'utils/jwt';
import {ACCESS_TOKEN_KEY, API_URL, AppContext} from '../../constants';

export const fetchUserService = () => axiosInstance.get(`${API_URL.User}/me`).then((response) => response.data);

export const fetchUserThunk = createAsyncThunkWithErrorHandler(`${AppContext.Auth}/fetchUser`, async () =>
	fetchUserService()
);

export const loginThunk = createAsyncThunkWithErrorHandler(`${AppContext.Auth}/login`, async (params) =>
	axiosInstance.post(`${API_URL.Auth}/login`, params).then((response) => {
		setSession(response.data.token);
		console.log(response);
		return fetchUserService();
	})
);

export const updateMeThunk = createAsyncThunkWithErrorHandler(`${AppContext.User}/me`, async (data) =>
	axiosInstance.patch(`${API_URL.User}/me`, data).then(() => data)
);

export const updatePasswordThunk = createAsyncThunkWithErrorHandler(
	`${AppContext.User}/update_password`,
	async (data) => axiosInstance.patch(`${API_URL.User}/update_password`, data).then(() => data)
);

export const registerThunk = createAsyncThunkWithErrorHandler(`${AppContext.Auth}/signup/supplier`, async (data) =>
	axiosInstance.post(`${API_URL.Auth}/signup/supplier`, data).then(() => data)
);
