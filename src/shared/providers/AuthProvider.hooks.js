import {useSelector} from 'react-redux';
import {useDispatchAction} from '../hooks';
import {authStateSelector} from '../redux/selectors/auth';
import {initializeAuth} from '../redux/slices/auth';
import {fetchUserThunk, loginThunk} from '../redux/thunks/auth';

export const useInitializeAuth = () => useDispatchAction(initializeAuth);

export const useFetchUser = () => useDispatchAction(fetchUserThunk);

export const useLogin = () => useDispatchAction(loginThunk);

export const useAuthState = () => useSelector(authStateSelector);
