import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './slices/auth';
import blogReducer from './slices/blog';
import calendarReducer from './slices/calendar';
import chatReducer from './slices/chat';
import kanbanReducer from './slices/kanban';
import mailReducer from './slices/mail';
import productReducer from './slices/product';
import userReducer from './slices/user';
import thunkActionsReducer from './slices/thunk';

const rootPersistConfig = {
	key: 'root',
	storage,
	keyPrefix: 'redux-',
	whitelist: []
};

const productPersistConfig = {
	key: 'product',
	storage,
	keyPrefix: 'redux-',
	whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
	mail: mailReducer,
	chat: chatReducer,
	blog: blogReducer,
	user: userReducer,
	calendar: calendarReducer,
	kanban: kanbanReducer,
	auth: authReducer,
	product: persistReducer(productPersistConfig, productReducer),
	thunk: thunkActionsReducer
});

export {rootPersistConfig, rootReducer};
