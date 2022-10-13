/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
// material
import {styled} from '@material-ui/core/styles';
import {Typography, Button, Card, CardContent} from '@material-ui/core';
import {SeoIllustration} from '../../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({theme}) => ({
	boxShadow: 'none',
	textAlign: 'center',
	backgroundColor: theme.palette.primary.lighter,
	[theme.breakpoints.up('md')]: {
		height: '100%',
		display: 'flex',
		textAlign: 'left',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
}));

// ----------------------------------------------------------------------

AppWelcome.propTypes = {
	displayName: PropTypes.string,
	displayRole: PropTypes.string
};

export default function AppWelcome({displayName, displayRole}) {
	return (
		<RootStyle>
			<CardContent
				sx={{
					p: {md: 0},
					pl: {md: 5},
					color: 'grey.800'
				}}
			>
				<Typography gutterBottom variant="h2">
					Chào mừng trở lại,
					<br /> {!displayName ? displayRole : displayName}!
				</Typography>
			</CardContent>

			<SeoIllustration
				sx={{
					p: 3,
					width: 200,
					margin: {xs: 'auto', md: 'inherit'}
				}}
			/>
		</RootStyle>
	);
}
