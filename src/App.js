// routes
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import ScrollToTop from './components/ScrollToTop';
// components
import ThemePrimaryColor from './components/ThemePrimaryColor';
// hooks
import useAuth from './shared/hooks/useAuth';
import Router from './shared/routes';
// theme
import ThemeConfig from './theme';

// ----------------------------------------------------------------------

export default function App() {
	const {isInitialized} = useAuth();

	return (
		<ThemeConfig>
			<ThemePrimaryColor>
				<NotistackProvider>
					<ScrollToTop />
					{isInitialized ? <Router /> : <LoadingScreen />}
				</NotistackProvider>
			</ThemePrimaryColor>
		</ThemeConfig>
	);
}
