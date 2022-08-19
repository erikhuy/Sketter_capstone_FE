// material
import {Container, Grid} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {ContactForm, ContactHero, ContactMap} from '../components/_external-pages/contact';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	paddingTop: theme.spacing(8),
	[theme.breakpoints.up('md')]: {
		paddingTop: theme.spacing(11)
	}
}));

// ----------------------------------------------------------------------

export default function Contact() {
	return (
		<RootStyle title="Contact us | Minimal-UI">
			<ContactHero />

			<Container sx={{my: 10}}>
				<Grid container spacing={10}>
					<Grid item xs={12} md={6}>
						<ContactForm />
					</Grid>
					<Grid item xs={12} md={6}>
						<ContactMap />
					</Grid>
				</Grid>
			</Container>
		</RootStyle>
	);
}
