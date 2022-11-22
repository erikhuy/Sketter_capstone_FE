// mock api
// material
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

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
