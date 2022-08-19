// material
import {Card, Container} from '@material-ui/core';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getLabels} from 'shared/redux/slices/mail';
// redux
import {useDispatch} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {MailCompose, MailDetails, MailList, MailSidebar} from '../../components/_dashboard/mail';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function Mail() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const {mailId} = useParams();
	const [openSidebar, setOpenSidebar] = useState(false);
	const [openCompose, setOpenCompose] = useState(false);

	useEffect(() => {
		dispatch(getLabels());
	}, [dispatch]);

	return (
		<Page title="Mail | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<HeaderBreadcrumbs
					heading="Mail"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root
						},
						{name: 'Mail'}
					]}
				/>
				<Card sx={{height: {md: '72vh'}, display: {md: 'flex'}}}>
					<MailSidebar
						isOpenSidebar={openSidebar}
						onCloseSidebar={() => setOpenSidebar(false)}
						onOpenCompose={() => setOpenCompose(true)}
					/>
					{mailId ? <MailDetails /> : <MailList onOpenSidebar={() => setOpenSidebar(true)} />}
					<MailCompose isOpenCompose={openCompose} onCloseCompose={() => setOpenCompose(false)} />
				</Card>
			</Container>
		</Page>
	);
}
