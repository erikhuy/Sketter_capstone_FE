// material
import {Container, Grid, Skeleton} from '@material-ui/core';
import {useEffect} from 'react';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getUsers} from 'shared/redux/slices/user';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {UserCard} from '../../components/_dashboard/user/cards';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const SkeletonLoad = (
	<>
		{[...Array(8)].map((_, index) => (
			<Grid item xs={12} sm={6} md={4} key={index}>
				<Skeleton variant="rectangular" width="100%" sx={{paddingTop: '115%', borderRadius: 2}} />
			</Grid>
		))}
	</>
);

export default function UserCards() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const {users} = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(getUsers());
	}, [dispatch]);

	return (
		<Page title="User: Cards | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading="User Cards"
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{name: 'User', href: PATH_DASHBOARD.user.root},
						{name: 'Cards'}
					]}
				/>
				<Grid container spacing={3}>
					{users.map((user) => (
						<Grid key={user.id} item xs={12} sm={6} md={4}>
							<UserCard user={user} />
						</Grid>
					))}

					{!users.length && SkeletonLoad}
				</Grid>
			</Container>
		</Page>
	);
}
