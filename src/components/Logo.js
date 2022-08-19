import PropTypes from 'prop-types';
// material
import {useTheme} from '@material-ui/core/styles';
import {Box} from '@material-ui/core';

// ----------------------------------------------------------------------

Logo.propTypes = {
	sx: PropTypes.object
};

export default function Logo({sx}) {
	const theme = useTheme();
	const PRIMARY_LIGHT = theme.palette.primary.light;
	const PRIMARY_MAIN = theme.palette.primary.main;
	const PRIMARY_DARK = theme.palette.primary.dark;

	return (
		<Box sx={{width: 120, height: 120, ...sx}}>
			<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
				<path
					d="M559.24,210.74h71.47v87.47H559.24a16,16,0,0,1-16-16V226.74A16,16,0,0,1,559.24,210.74Z"
					fill="#ffcc1f"
				/>
				<path d="M630.71,210.74h71.47a16,16,0,0,1,16,16v71.47H630.71V210.74Z" fill="#f9d756" />
				<path
					d="M630.71,298.21h87.47v71.47a16,16,0,0,1-16,16H646.71a16,16,0,0,1-16-16V298.21Z"
					fill="#f2e18d"
				/>
				<path
					d="M296.82,385.68h71.47v87.47H296.82a16,16,0,0,1-16-16V401.69a16,16,0,0,1,16-16Z"
					fill="#3347ad"
				/>
				<rect x="368.29" y="385.68" width="87.47" height="87.47" fill="#465fbb" />
				<path d="M455.76,385.68h71.47a16,16,0,0,1,16,16v71.47H455.76V385.68Z" fill="#5a76c9" />
				<path d="M368.29,473.16h87.47v87.47H384.29a16,16,0,0,1-16-16V473.16Z" fill="#6d8ed6" />
				<rect x="455.76" y="473.16" width="87.47" height="87.47" fill="#81a5e4" />
				<path
					d="M455.76,560.63h87.47V632.1a16,16,0,0,1-16,16H471.76a16,16,0,0,1-16-16V560.63Z"
					fill="#94bdf2"
				/>
			</svg>
		</Box>
	);
}
