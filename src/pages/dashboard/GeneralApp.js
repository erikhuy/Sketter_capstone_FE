// material
import {Container, Grid} from '@material-ui/core';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useSettings from 'shared/hooks/useSettings';
import {
	AppAreaInstalled,
	AppCurrentDownload,
	AppFeatured,
	AppNewInvoice,
	AppTopAuthors,
	AppTopInstalledCountries,
	AppTopRelated,
	AppTotalActiveUsers,
	AppTotalDownloads,
	AppTotalInstalled,
	AppWelcome,
	AppWidgets1,
	AppWidgets2
} from '../../components/_dashboard/general-app';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function GeneralApp() {
	const {themeStretch} = useSettings();
	const {user} = useAuth();

	return (
		<Page title="General: App | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<AppWelcome displayName={user.name} />
					</Grid>

					<Grid item xs={12} md={4}>
						<AppFeatured />
					</Grid>

					<Grid item xs={12} md={4}>
						<AppTotalActiveUsers />
					</Grid>

					<Grid item xs={12} md={4}>
						<AppTotalInstalled />
					</Grid>

					<Grid item xs={12} md={4}>
						<AppTotalDownloads />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<AppCurrentDownload />
					</Grid>

					<Grid item xs={12} md={6} lg={8}>
						<AppAreaInstalled />
					</Grid>

					<Grid item xs={12} lg={8}>
						<AppNewInvoice />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<AppTopRelated />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<AppTopInstalledCountries />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<AppTopAuthors />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<AppWidgets1 />
							</Grid>
							<Grid item xs={12}>
								<AppWidgets2 />
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
}
