// material
import {createTheme, ThemeProvider, useTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// hooks
import useLocales from 'shared/hooks/useLocales';

// ----------------------------------------------------------------------

ThemeLocalization.propTypes = {
	children: PropTypes.node
};

export default function ThemeLocalization({children}) {
	const defaultTheme = useTheme();
	const {currentLang} = useLocales();

	const theme = createTheme(defaultTheme, currentLang.systemValue);

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
