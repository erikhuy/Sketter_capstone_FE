import {Box, Container, Tab} from '@material-ui/core';
// material
import {styled} from '@material-ui/core/styles';
import {TabContext, TabList, TabPanel} from '@material-ui/lab';
import {useState} from 'react';
// routes
import {PATH_PAGE} from 'shared/routes/paths';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// material
import Page from '../../../../components/Page';
//
import Filled from './Filled';
import Outlined from './Outlined';
import Standard from './Standard';

// ----------------------------------------------------------------------

const TEXTFIELDS = [
	{name: 'Filled', component: <Filled />},
	{name: 'Standard', component: <Standard />},
	{name: 'Outlined', component: <Outlined />}
];

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	paddingTop: theme.spacing(11),
	paddingBottom: theme.spacing(15)
}));

export default function TextFieldComponent() {
	const [value, setValue] = useState('1');

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// ----------------------------------------------------------------------

	return (
		<RootStyle title="Components: TextField | Minimal-UI">
			<Box
				sx={{
					pt: 6,
					pb: 1,
					mb: 10,
					bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
				}}
			>
				<Container maxWidth="lg">
					<HeaderBreadcrumbs
						heading="TextField"
						links={[{name: 'Components', href: PATH_PAGE.components}, {name: 'TextField'}]}
						moreLink="https://next.material-ui.com/components/text-fields"
					/>
				</Container>
			</Box>

			<Container maxWidth="lg">
				<form noValidate autoComplete="off">
					<TabContext value={value}>
						<TabList onChange={handleChange}>
							{TEXTFIELDS.map((tab, index) => (
								<Tab disableRipple key={tab.name} label={tab.name} value={String(index + 1)} />
							))}
						</TabList>

						{TEXTFIELDS.map((tab, index) => (
							<TabPanel key={tab.name} value={String(index + 1)} sx={{mt: 5}}>
								{tab.component}
							</TabPanel>
						))}
					</TabContext>
				</form>
			</Container>
		</RootStyle>
	);
}
