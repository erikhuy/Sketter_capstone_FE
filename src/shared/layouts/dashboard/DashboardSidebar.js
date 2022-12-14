/* eslint-disable no-undef */
import {Box, Button, CardActionArea, Drawer, Link, Stack, Tooltip, Typography} from '@material-ui/core';
// material
import {alpha, styled} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack5';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useCollapseDrawer from 'shared/hooks/useCollapseDrawer';
// routes
import {PATH_DASHBOARD, PATH_DOCS} from 'shared/routes/paths';
import {DocIcon} from '../../../assets';
import {MHidden} from '../../../components/@material-extend';
// components
import Logo from '../../../components/Logo';
import MyAvatar from '../../../components/MyAvatar';
import NavSection from '../../../components/NavSection';
import Scrollbar from '../../../components/Scrollbar';
//
import sidebarConfigAdmin from './SidebarConfigAdmin';
import sidebarConfigSupplier from './SidebarConfigSupplier';
import sidebarConfigSupplierManager from './SidebarConfigSupplierManager';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const COLLAPSE_WIDTH = 102;

const RootStyle = styled('div')(({theme}) => ({
	[theme.breakpoints.up('lg')]: {
		flexShrink: 0,
		transition: theme.transitions.create('width', {
			duration: theme.transitions.duration.complex
		})
	}
}));

const AccountStyle = styled('div')(({theme}) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2, 2.5),
	borderRadius: theme.shape.borderRadiusSm,
	backgroundColor: theme.palette.grey[500_12]
}));

const DocStyle = styled('div')(({theme}) => ({
	padding: theme.spacing(2.5),
	borderRadius: theme.shape.borderRadiusMd,
	backgroundColor:
		theme.palette.mode === 'light' ? alpha(theme.palette.primary.main, 0.08) : theme.palette.primary.lighter
}));

// ----------------------------------------------------------------------

IconCollapse.propTypes = {
	onToggleCollapse: PropTypes.func,
	collapseClick: PropTypes.bool
};

function IconCollapse({onToggleCollapse, collapseClick}) {
	return (
		<Tooltip title="Mini Menu">
			<CardActionArea
				onClick={onToggleCollapse}
				sx={{
					width: 18,
					height: 18,
					display: 'flex',
					cursor: 'pointer',
					borderRadius: '50%',
					alignItems: 'center',
					color: 'text.primary',
					justifyContent: 'center',
					border: 'solid 1px currentColor',
					...(collapseClick && {
						borderWidth: 2
					})
				}}
			>
				<Box
					sx={{
						width: 8,
						height: 8,
						borderRadius: '50%',
						bgcolor: 'currentColor',
						transition: (theme) => theme.transitions.create('all'),
						...(collapseClick && {
							width: 0,
							height: 0
						})
					}}
				/>
			</CardActionArea>
		</Tooltip>
	);
}
function ChangeRoleToText(role) {
	if (role === 1) {
		return 'admin';
	}
	if (role === 2) {
		return 'supplier manager';
	}
	if (role === 3) {
		return 'supplier';
	}
	if (role === 4) {
		return 'user';
	}
}
DashboardSidebar.propTypes = {
	isOpenSidebar: PropTypes.bool,
	onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({isOpenSidebar, onCloseSidebar}) {
	const {pathname} = useLocation();
	const {user, logout} = useAuth();
	const {enqueueSnackbar} = useSnackbar();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/');
		} catch (error) {
			console.error(error);
			enqueueSnackbar('Kh??ng th??? ????ng xu???t', {variant: 'error'});
		}
	};
	const {isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave} =
		useCollapseDrawer();

	useEffect(() => {
		if (isOpenSidebar) {
			onCloseSidebar();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	const renderContent = (
		<Scrollbar
			sx={{
				height: 1,
				'& .simplebar-content': {
					height: 1,
					display: 'flex',
					flexDirection: 'column'
				}
			}}
		>
			<Stack
				spacing={3}
				sx={{
					px: 2.5,
					pt: 3,
					pb: 2,
					...(isCollapse && {
						alignItems: 'center'
					})
				}}
			>
				<Box component={RouterLink} to="/" sx={{display: 'flex', justifyContent: 'center'}}>
					<Logo />
				</Box>

				{isCollapse ? (
					<MyAvatar sx={{mx: 'auto', mb: 2}} />
				) : (
					<Link underline="none" component={RouterLink} to={PATH_DASHBOARD.user.account}>
						<AccountStyle>
							<MyAvatar />
							<Box sx={{ml: 2}}>
								<Typography variant="subtitle2" sx={{color: 'text.primary'}}>
									{user?.name}
								</Typography>
								<Typography variant="body2" sx={{color: 'text.secondary'}}>
									{user?.role.description}
									{/* {user?.roleID} */}
								</Typography>
							</Box>
						</AccountStyle>
					</Link>
				)}
			</Stack>

			<NavSection
				navConfig={
					// eslint-disable-next-line no-nested-ternary
					user.role.description === '?????i t??c'
						? sidebarConfigSupplier
						: user.role.description === 'Qu???n l??'
						? sidebarConfigSupplierManager
						: sidebarConfigAdmin
				}
				isShow={!isCollapse}
			/>
			<Box sx={{p: 2, pt: 1.5, position: 'absolute', top: '90%', width: '100%'}}>
				<Button fullWidth color="inherit" variant="outlined" onClick={handleLogout}>
					????ng xu???t
				</Button>
			</Box>
		</Scrollbar>
	);

	return (
		<RootStyle
			sx={{
				width: {
					lg: isCollapse ? COLLAPSE_WIDTH : DRAWER_WIDTH
				},
				...(collapseClick && {
					position: 'absolute'
				})
			}}
		>
			<MHidden width="lgUp">
				<Drawer
					open={isOpenSidebar}
					onClose={onCloseSidebar}
					PaperProps={{
						sx: {width: DRAWER_WIDTH}
					}}
				>
					{renderContent}
				</Drawer>
			</MHidden>

			<MHidden width="lgDown">
				<Drawer
					open
					variant="persistent"
					onMouseEnter={onHoverEnter}
					onMouseLeave={onHoverLeave}
					PaperProps={{
						sx: {
							width: DRAWER_WIDTH,
							bgcolor: 'background.default',
							...(isCollapse && {
								width: COLLAPSE_WIDTH
							}),
							...(collapseHover && {
								borderRight: 0,
								backdropFilter: 'blur(6px)',
								WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
								boxShadow: (theme) => theme.customShadows.z20,
								bgcolor: (theme) => alpha(theme.palette.background.default, 0.88)
							})
						}
					}}
				>
					{renderContent}
				</Drawer>
			</MHidden>
		</RootStyle>
	);
}
