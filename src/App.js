// routes
import GoogleAnalytics from './components/GoogleAnalytics';
import LoadingScreen from './components/LoadingScreen';
import NotistackProvider from './components/NotistackProvider';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
// components
import Settings from './components/settings';
import ThemeLocalization from './components/ThemeLocalization';
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
				<ThemeLocalization>
					<RtlLayout>
						<NotistackProvider>
							<ScrollToTop />
							<GoogleAnalytics />
							{isInitialized ? <Router /> : <LoadingScreen />}
						</NotistackProvider>
					</RtlLayout>
				</ThemeLocalization>
			</ThemePrimaryColor>
		</ThemeConfig>
	);
}
