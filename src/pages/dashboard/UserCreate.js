// material
import {Container} from '@material-ui/core';
import {paramCase} from 'change-case';
import {useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getUserList} from 'shared/redux/slices/user';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import UserNewForm from '../../components/_dashboard/user/UserNewForm';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function UserCreate() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const {pathname} = useLocation();
	const {name} = useParams();
	const {userList} = useSelector((state) => state.user);
	const isEdit = pathname.includes('edit');
	const currentUser = userList.find((user) => paramCase(user.name) === name);

	useEffect(() => {
		dispatch(getUserList());
	}, [dispatch]);

	return (
		<Page title="User: Create a new user | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading={!isEdit ? 'Create a new user' : 'Edit user'}
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{name: 'User', href: PATH_DASHBOARD.user.root},
						{name: !isEdit ? 'New user' : name}
					]}
				/>

				<UserNewForm isEdit={isEdit} currentUser={currentUser} />
			</Container>
		</Page>
	);
}
