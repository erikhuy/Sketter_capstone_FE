import {configureStore} from '@reduxjs/toolkit';
import {useDispatch as useReduxDispatch, useSelector as useReduxSelector} from 'react-redux';
import {persistReducer, persistStore} from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import {rootPersistConfig, rootReducer} from './rootReducer';

const store = configureStore({
	reducer: persistReducer(rootPersistConfig, rootReducer),
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware({
			serializableCheck: false,
			immutableCheck: false
		}),
		thunkMiddleware
	]
});

const persistor = persistStore(store);

const useSelector = useReduxSelector;

const useDispatch = () => useReduxDispatch();

export {store, persistor, useSelector, useDispatch};
