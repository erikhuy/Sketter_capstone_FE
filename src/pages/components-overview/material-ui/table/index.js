// material
import {Box, Card, CardHeader, Container, Stack} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
// routes
import {PATH_PAGE} from 'shared/routes/paths';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../../components/Page';
//
import BasicTable from './BasicTable';
import CollapsibleTable from './collapsible-table';
import GroupingFixedHeader from './GroupingFixedHeader';
import SortingSelecting from './sorting-selecting';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	paddingTop: theme.spacing(11),
	paddingBottom: theme.spacing(15)
}));

export default function TableComponent() {
	return (
		<RootStyle title="Components: Table | Minimal-UI">
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
						heading="Table"
						links={[{name: 'Components', href: PATH_PAGE.components}, {name: 'Table'}]}
						moreLink="https://next.material-ui.com/components/tables"
					/>
				</Container>
			</Box>

			<Container maxWidth="lg">
				<Stack spacing={5}>
					<Card>
						<CardHeader title="Basic Table" />
						<BasicTable />
					</Card>

					<Card>
						<SortingSelecting />
					</Card>

					<Card>
						<CardHeader title="Grouping & FixedHeader" />
						<GroupingFixedHeader />
					</Card>

					<Card>
						<CardHeader title="Collapsible Table" />
						<CollapsibleTable />
					</Card>
				</Stack>
			</Container>
		</RootStyle>
	);
}
