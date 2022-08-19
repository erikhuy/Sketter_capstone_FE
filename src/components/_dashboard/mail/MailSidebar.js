import plusFill from '@iconify/icons-eva/plus-fill';
import {Icon} from '@iconify/react';
// material
import {Box, Button, Divider, Drawer, List} from '@material-ui/core';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
// redux
import {useSelector} from 'shared/redux/store';
import {MHidden} from '../../@material-extend';
//
import Scrollbar from '../../Scrollbar';
import MailSidebarItem from './MailSidebarItem';

// ----------------------------------------------------------------------

MailSidebar.propTypes = {
	isOpenSidebar: PropTypes.bool,
	onOpenCompose: PropTypes.func,
	onCloseSidebar: PropTypes.func
};

export default function MailSidebar({isOpenSidebar, onOpenCompose, onCloseSidebar}) {
	const {pathname} = useLocation();
	const {labels} = useSelector((state) => state.mail);

	useEffect(() => {
		if (isOpenSidebar) {
			onCloseSidebar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const handleOpenCompose = () => {
		onCloseSidebar();
		onOpenCompose();
	};

	const renderContent = (
		<Scrollbar>
			<Box sx={{p: 3}}>
				<Button fullWidth variant="contained" startIcon={<Icon icon={plusFill} />} onClick={handleOpenCompose}>
					Compose
				</Button>
			</Box>

			<Divider />

			<List disablePadding>
				{labels.map((label) => (
					<MailSidebarItem key={label.id} label={label} />
				))}
			</List>
		</Scrollbar>
	);

	return (
		<>
			<MHidden width="mdUp">
				<Drawer
					open={isOpenSidebar}
					onClose={onCloseSidebar}
					ModalProps={{keepMounted: true}}
					PaperProps={{sx: {width: 280}}}
				>
					{renderContent}
				</Drawer>
			</MHidden>

			<MHidden width="mdDown">
				<Drawer variant="permanent" PaperProps={{sx: {width: 280, position: 'relative'}}}>
					{renderContent}
				</Drawer>
			</MHidden>
		</>
	);
}
