/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
import baselineDisabledByDefault from '@iconify/icons-ic/baseline-disabled-by-default';
import CreateIcon from '@material-ui/icons/Create';
import {Icon} from '@iconify/react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Modal,
	Stack,
	Toolbar,
	Tooltip,
	Typography
} from '@material-ui/core';
// material
import {styled, useTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {API_URL} from 'shared/constants';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {Box} from '@material-ui/system';
import {LoginForm} from 'components/authentication/login';
import DestinationDetailForm from 'pages/dashboard/destination/DestinationDetailForm';
import useAuth from 'shared/hooks/useAuth';
import UserDetailForm from 'pages/dashboard/admin/UserDetailForm';
import {useSnackbar} from 'notistack5';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
	height: 96,
	display: 'flex',
	justifyContent: 'space-between',
	padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

SortingSelectingToolbar.propTypes = {
	numSelected: PropTypes.any.isRequired,
	reloadData: PropTypes.any,
	reloadNumber: PropTypes.any,
	idSelected: PropTypes.any.isRequired
};
const styles = {
	position: 'absolute',
	bottom: '50%',
	height: '100%',
	display: 'block'
};
const style = {
	'&::-webkit-scrollbar': {
		display: 'none'
	},
	position: 'absolute',
	overflow: 'scroll',
	borderRadius: '25px',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	height: '100%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4
};
export default function SortingSelectingToolbar({onReloadList, numSelected, idSelected, reloadData, reloadNumber}) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [reloadList, setReload] = useState();
	const {enqueueSnackbar} = useSnackbar();
	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);
	const [resetToolbar, setResetToolbar] = useState([]);
	const {user} = useAuth();

	const deactivatedUser = useCallback(
		async (idSelected) => {
			try {
				console.log(idSelected);
				await Promise.all(
					idSelected.map(async (id) => {
						// eslint-disable-next-line no-restricted-globals, no-global-assign
						await axios
							.delete(`${API_URL.User}/${id}`)
							.then((res) => {
								reloadData([]);
								reloadNumber([]);
								enqueueSnackbar('Ngưng hoạt động tài khoản thành công', {variant: 'success'});
								setOpenDialog(false);
							})
							.catch((e) => {
								console.log(e.response.data.message);
								enqueueSnackbar(e.response.data.message, {variant: 'error'});
							});
					})
				);
			} catch (e) {
				enqueueSnackbar(e.data.message, {variant: 'error'});
				setOpenDialog(false);
			}
		},
		[resetToolbar]
	);
	useEffect(() => {
		onReloadList(reloadList);
		reloadData([]);
		reloadNumber([]);
	}, [reloadList]);
	const theme = useTheme();
	const isLight = theme.palette.mode === 'light';
	return (
		<RootStyle
			sx={{
				...(idSelected.length > 0 && {
					color: isLight ? 'primary.main' : 'text.primary',
					bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
				})
			}}
		>
			{idSelected.length > 0 ? (
				<Typography color="inherit" variant="subtitle1" component="div">
					{idSelected.length} tài khoản đang được chọn
				</Typography>
			) : (
				<Typography variant="h6" id="tableTitle" component="div">
					Danh sách tài khoản
				</Typography>
			)}
			{open && (
				<Modal
					sx={styles}
					// eslint-disable-next-line react/jsx-boolean-value
					open={true}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<UserDetailForm userID={idSelected} onReload={setReload} onOpenModal={handleClose} />
					</Box>
				</Modal>
			)}
			{openDialog && (
				<Dialog
					open={openDialog}
					onClose={handleCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Ngưng hoạt động tài khoản ?</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseDialog}>Hủy</Button>
						<Button onClick={() => deactivatedUser(idSelected)}>Đồng ý</Button>
					</DialogActions>
				</Dialog>
			)}
			{idSelected.length > 1 ? (
				<IconButton
					onClick={() => {
						handleOpenDialog();
					}}
				>
					<Icon icon={baselineDisabledByDefault} />
				</IconButton>
			) : idSelected.length === 1 ? (
				<Stack direction="row" spacing={1}>
					<IconButton
						onClick={() => {
							handleOpenDialog();
						}}
					>
						<Icon icon={baselineDisabledByDefault} />
					</IconButton>
					<IconButton
						onClick={() => {
							handleOpen();
						}}
					>
						<CreateIcon />
					</IconButton>
				</Stack>
			) : null}
		</RootStyle>
	);
}
