import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, {createContext, useCallback, useMemo, useRef} from 'react';
import {Cookies} from 'react-cookie';
import axiosInstance from 'utils/axios';
import {clearSession, isValidToken, setSession} from 'utils/jwt';
import {ACCESS_TOKEN_KEY} from '../constants';
import {useMounting} from '../hooks';
import {initialAuthState} from '../redux/slices/auth';
import {useAuthState, useFetchUser, useInitializeAuth, useLogin} from './AuthProvider.hooks';

export const AuthContext = createContext({
	...initialAuthState,
	method: 'jwt',
	login: noop,
	logout: noop
});

const AuthProvider = ({children}) => {
	const fetchUser = useFetchUser();
	const cookies = new Cookies();
	const tokenExpiredRef = useRef();
	const initializeAuth = useInitializeAuth();
	const authState = useAuthState();
	const login = useLogin();

	const handleStorageEvent = useCallback(
		({key, newValue}) => {
			if (key === 'token' && !newValue) {
				delete axiosInstance.defaults.headers.common.Authorization;
				initializeAuth();
			}
		},
		[initializeAuth]
	);

	const logout = useCallback(() => {
		initializeAuth();
		clearSession();
	}, [initializeAuth]);

	useMounting(
		() => {
			const accessToken = window.localStorage.getItem('token');
			if (accessToken && isValidToken(accessToken)) {
				tokenExpiredRef.current = setSession(accessToken);
				fetchUser();
			} else {
				initializeAuth();
			}

			window.addEventListener('storage', handleStorageEvent);
		},
		() => {
			window.removeEventListener('storage', handleStorageEvent);
			if (tokenExpiredRef.current) {
				clearTimeout(tokenExpiredRef.current);
			}
		}
	);

	const memoizedContextValues = useMemo(
		() => ({
			...authState,
			method: 'jwt',
			login,
			logout
		}),
		[authState, login]
	);

	return (
		<AuthContext.Provider value={memoizedContextValues}>{authState.isInitialized && children}</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export default React.memo(AuthProvider);
