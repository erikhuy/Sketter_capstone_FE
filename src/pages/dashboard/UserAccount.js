import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import {Icon} from '@iconify/react';
// material
import {Box, Container, Stack, Tab, Tabs} from '@material-ui/core';
import {capitalCase} from 'change-case';
import {useEffect, useState} from 'react';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getAddressBook, getCards, getInvoices, getNotifications, getProfile} from 'shared/redux/slices/user';
// redux
import {useDispatch} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {AccountChangePassword, AccountGeneral} from '../../components/_dashboard/user/account';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function UserAccount() {
	const {themeStretch} = useSettings();
	const [currentTab, setCurrentTab] = useState('general');
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getCards());
		dispatch(getAddressBook());
		dispatch(getInvoices());
		dispatch(getNotifications());
		dispatch(getProfile());
	}, [dispatch]);

	const ACCOUNT_TABS = [
		{
			value: 'general',
			icon: <Icon icon={roundAccountBox} width={20} height={20} />,
			component: <AccountGeneral />
		},
		{
			value: 'change_password',
			icon: <Icon icon={roundVpnKey} width={20} height={20} />,
			component: <AccountChangePassword />
		}
	];

	const handleChangeTab = (event, newValue) => {
		setCurrentTab(newValue);
	};

	return (
		<Page title="Sketter">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading="Account"
					links={[{name: 'Dashboard', href: PATH_DASHBOARD.root}, {name: 'User'}]}
				/>

				<Stack spacing={5}>
					<Tabs
						value={currentTab}
						scrollButtons="auto"
						variant="scrollable"
						allowScrollButtonsMobile
						onChange={handleChangeTab}
					>
						{ACCOUNT_TABS.map((tab) => (
							<Tab
								disableRipple
								key={tab.value}
								label={capitalCase(tab.value)}
								icon={tab.icon}
								value={tab.value}
							/>
						))}
					</Tabs>

					{ACCOUNT_TABS.map((tab) => {
						const isMatched = tab.value === currentTab;
						return isMatched && <Box key={tab.value}>{tab.component}</Box>;
					})}
				</Stack>
			</Container>
		</Page>
	);
}
