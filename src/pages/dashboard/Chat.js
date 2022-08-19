// material
import {Card, Container} from '@material-ui/core';
import {useEffect} from 'react';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getContacts, getConversations} from 'shared/redux/slices/chat';
// redux
import {useDispatch} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {ChatSidebar, ChatWindow} from '../../components/_dashboard/chat';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function Chat() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getConversations());
		dispatch(getContacts());
	}, [dispatch]);

	return (
		<Page title="Chat | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<HeaderBreadcrumbs
					heading="Chat"
					links={[{name: 'Dashboard', href: PATH_DASHBOARD.root}, {name: 'Chat'}]}
				/>
				<Card sx={{height: '72vh', display: 'flex'}}>
					<ChatSidebar />
					<ChatWindow />
				</Card>
			</Container>
		</Page>
	);
}
