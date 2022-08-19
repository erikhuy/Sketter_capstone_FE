// material
import {Box, Container, Paper, Stack} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
// routes
import {PATH_PAGE} from 'shared/routes/paths';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
//
import {Block} from '../../Block';
import CustomizedStepper from './CustomizedStepper';
import HorizontalLinearStepper from './HorizontalLinearStepper';
import LinearAlternativeLabel from './LinearAlternativeLabel';
import VerticalLinearStepper from './VerticalLinearStepper';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	paddingTop: theme.spacing(11),
	paddingBottom: theme.spacing(15)
}));

// ----------------------------------------------------------------------

export default function StepperComponent() {
	return (
		<RootStyle title="Components: StepperView | Minimal-UI">
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
						heading="Stepper"
						links={[{name: 'Components', href: PATH_PAGE.components}, {name: 'Stepper'}]}
						moreLink="https://next.material-ui.com/components/steppers"
					/>
				</Container>
			</Box>

			<Container maxWidth="lg">
				<Stack spacing={5}>
					<Block title="Horizontal Linear Stepper">
						<Paper
							sx={{
								p: 3,
								width: '100%',
								boxShadow: (theme) => theme.customShadows.z8
							}}
						>
							<HorizontalLinearStepper />
						</Paper>
					</Block>

					<Block title="Linear Alternative Label">
						<Paper
							sx={{
								p: 3,
								width: '100%',
								boxShadow: (theme) => theme.customShadows.z8
							}}
						>
							<LinearAlternativeLabel />
						</Paper>
					</Block>

					<Block title="Vertical Linear Stepper">
						<Paper
							sx={{
								p: 3,
								width: '100%',
								boxShadow: (theme) => theme.customShadows.z8
							}}
						>
							<VerticalLinearStepper />
						</Paper>
					</Block>

					<Block title="Customized Stepper">
						<Paper
							sx={{
								p: 3,
								width: '100%',
								boxShadow: (theme) => theme.customShadows.z8
							}}
						>
							<CustomizedStepper />
						</Paper>
					</Block>
				</Stack>
			</Container>
		</RootStyle>
	);
}
