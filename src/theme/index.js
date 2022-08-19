// material
import {CssBaseline} from '@material-ui/core';
import {createTheme, StyledEngineProvider, ThemeProvider} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import {useMemo} from 'react';
// hooks
import useSettings from 'shared/hooks/useSettings';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import palette from './palette';
import shadows, {customShadows} from './shadows';
//
import shape from './shape';
import typography from './typography';

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
	children: PropTypes.node
};

export default function ThemeConfig({children}) {
	const {themeMode, themeDirection} = useSettings();
	const isLight = themeMode === 'light';

	const themeOptions = useMemo(
		() => ({
			palette: isLight ? {...palette.light, mode: 'light'} : {...palette.dark, mode: 'dark'},
			shape,
			typography,
			breakpoints,
			direction: themeDirection,
			shadows: isLight ? shadows.light : shadows.dark,
			customShadows: isLight ? customShadows.light : customShadows.dark
		}),
		[isLight, themeDirection]
	);

	const theme = createTheme(themeOptions);
	theme.components = componentsOverride(theme);

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<GlobalStyles />
				{children}
			</ThemeProvider>
		</StyledEngineProvider>
	);
}
