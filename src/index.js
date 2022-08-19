// mock api
// material
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

// lazy image
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

// map
import 'mapbox-gl/dist/mapbox-gl.css';

import ReactDOM from 'react-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {HelmetProvider} from 'react-helmet-async';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';
import {Provider as ReduxProvider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {PersistGate} from 'redux-persist/lib/integration/react';

// scroll bar
import 'simplebar/src/simplebar.css';
import 'slick-carousel/slick/slick-theme.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
// import './_apis_';
//
import App from './App';
// components
import LoadingScreen from './components/LoadingScreen';

// i18n
import './locales/i18n';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import {CollapseDrawerProvider} from './shared/contexts/CollapseDrawerContext';
// contexts
import {SettingsProvider} from './shared/contexts/SettingsContext';
import UserProvider from './shared/providers/AuthProvider';
// redux
import {persistor, store} from './shared/redux/store';

// highlight
import './utils/highlight';

// ----------------------------------------------------------------------

ReactDOM.render(
	<HelmetProvider>
		<ReduxProvider store={store}>
			<PersistGate loading={<LoadingScreen />} persistor={persistor}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<SettingsProvider>
						<CollapseDrawerProvider>
							<BrowserRouter>
								<UserProvider>
									<App />
								</UserProvider>
							</BrowserRouter>
						</CollapseDrawerProvider>
					</SettingsProvider>
				</LocalizationProvider>
			</PersistGate>
		</ReduxProvider>
	</HelmetProvider>,
	document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
