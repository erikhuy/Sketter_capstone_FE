/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import CreateIcon from '@material-ui/icons/Create';
import Reviews from '@material-ui/icons/Reviews';
import {Icon} from '@iconify/react';
import {
	Button,
	Dialog,
	DialogActions,
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
import DestinationDetailFormSupplierManager from 'pages/dashboard/destination/DestinationDetailFormSupplierManager';
import ReviewList from 'pages/dashboard/destination/review/ReviewList';
import {useSnackbar} from 'notistack5';
import PromotionDetailForm from 'pages/dashboard/promotion/PromotionDetailForm';

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
	left: '10%',
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
	width: 1200,
	height: '90%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4
};
export default function SortingSelectingToolbar({onReloadList, numSelected, idSelected, reloadData, reloadNumber}) {
	const [open, setOpen] = useState(false);
	const [openReview, setReviewOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [reloadList, setReload] = useState();
	const handleReviewOpen = () => setReviewOpen(true);
	const handleReviewClose = () => setReviewOpen(false);
	const handleOpenDialog = () => setOpenDialog(true);
	const handleCloseDialog = () => setOpenDialog(false);
	const [resetToolbar, setResetToolbar] = useState([]);
	const {user} = useAuth();
	const [openDialog, setOpenDialog] = useState(false);
	const {enqueueSnackbar} = useSnackbar();

	const deletePromotion = useCallback(
		async (idSelected) => {
			try {
				await Promise.all(
					idSelected.map(async (id) => {
						await axios.delete(`${API_URL.Voucher}/${id}`).then((res) => {
							if (res.status === 204) {
								reloadData([]);
								reloadNumber([]);
								setResetToolbar('');
							}
						});
					})
				).then(() => {
					handleCloseDialog();
					enqueueSnackbar('Xóa khuyến mãi thành công', {variant: 'success'});
				});
			} catch (e) {
				console.log('');
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
					{idSelected.length} khuyến mãi đang được chọn
				</Typography>
			) : (
				<Typography variant="h6" id="tableTitle" component="div">
					Danh sách khuyến mãi
				</Typography>
			)}
			{openDialog && (
				<Dialog
					open={openDialog}
					onClose={handleCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{idSelected.length === 1 ? 'Xóa khuyến mãi này?' : 'Xóa những khuyến mãi này?'}
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCloseDialog}>Hủy</Button>
						<Button onClick={() => deletePromotion(idSelected)}>Đồng ý</Button>

						{/* <Button onClick={() => deactivatedUser(idSelected)}>Đồng ý</Button> */}
					</DialogActions>
				</Dialog>
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
						<PromotionDetailForm promotionID={idSelected} onReload={setReload} onOpenModal={handleClose} />
					</Box>
				</Modal>
			)}
			{idSelected.length > 1 ? (
				<IconButton
					onClick={() => {
						handleOpenDialog();
					}}
				>
					<Icon icon={trash2Fill} />
				</IconButton>
			) : idSelected.length === 1 ? (
				<Stack direction="row" spacing={1}>
					<IconButton
						onClick={() => {
							handleOpenDialog();
						}}
					>
						<Icon icon={trash2Fill} />
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
