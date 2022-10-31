/* eslint-disable prettier/prettier */
import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBXv3WSQwKSuxqL_65ycodGygbQFvsOZT8',
	authDomain: 'sketter-d471a.firebaseapp.com',
	projectId: 'sketter-d471a',
	storageBucket: 'sketter-d471a.appspot.com',
	messagingSenderId: '898798105351',
	appId: '1:898798105351:web:fd2e3597f65b4df111cba2'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
