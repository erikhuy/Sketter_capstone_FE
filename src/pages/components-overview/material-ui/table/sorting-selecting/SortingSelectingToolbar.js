/* eslint-disable no-constant-condition */
/* eslint-disable no-nested-ternary */
import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import CreateIcon from '@material-ui/icons/Create';
import {Icon} from '@iconify/react';
import {IconButton, Modal, Stack, Toolbar, Tooltip, Typography} from '@material-ui/core';
// material
import {styled, useTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {API_URL} from 'shared/constants';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {Box} from '@material-ui/system';
import {LoginForm} from 'components/authentication/login';
import UpdateDestinationForm from 'pages/dashboard/destination/UpdateDestinationForm';

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
	top: '10%',
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
	height: '100%',
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4
};
export default function SortingSelectingToolbar({numSelected, idSelected, reloadData, reloadNumber}) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [resetToolbar, setResetToolbar] = useState([]);
	const [destinationDetail, setDestinationDetail] = useState({
		name: '',
		address: '',
		longitude: '',
		latitude: '',
		location: null,
		phone: '',
		email: '',
		description: '',
		lowestPrice: '',
		highestPrice: '',
		openingTime: null,
		closingTime: null,
		estimatedTimeStay: '',
		recommendedTimes: [
			{
				start: '',
				end: ''
			}
		],
		destinationPersonalities: [],
		catalogs: [],
		images: [
			{
				url: ''
			}
		]
	});
	const deleteDestination = useCallback(
		async (idSelected) => {
			try {
				await Promise.all(
					idSelected.map(async (id) => {
						await axios.delete(`${API_URL.Destination}/${id}`).then((res) => {
							if (res.status === 204) {
								reloadData([]);
								reloadNumber([]);
								setResetToolbar('');
							}
						});
					})
				);
			} catch (e) {
				console.log('');
			}
		},
		[resetToolbar]
	);

	// const getDestinationDetail = useCallback(async (idSelected) => {
	// 	handleOpen();
	// 	try {
	// 		if (idSelected.length === 1) {
	// 			await Promise.all(
	// 				idSelected.map(async (id) => {
	// 					await axios.get(`${API_URL.Destination}/${id}`).then((res) => {
	// 						if (res.status === 200) {
	// 							reloadData([]);
	// 							reloadNumber([]);
	// 							setResetToolbar('');
	// 							setDestinationDetail(res.data.data);
	// 							console.log(res.data.data);
	// 						}
	// 					});
	// 				})
	// 			);
	// 		}
	// 	} catch (e) {
	// 		console.log('');
	// 	}
	// });

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
					{idSelected.length} is selected
				</Typography>
			) : (
				<Typography variant="h6" id="tableTitle" component="div">
					Danh sách địa điểm
				</Typography>
			)}
			<Modal
				sx={styles}
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<UpdateDestinationForm destinationID={idSelected} />
				</Box>
			</Modal>
			{idSelected.length > 1 ? (
				<IconButton
					onClick={() => {
						deleteDestination(idSelected);
					}}
				>
					<Icon icon={trash2Fill} />
				</IconButton>
			) : idSelected.length === 1 ? (
				<Stack direction="row" spacing={1}>
					<IconButton
						onClick={() => {
							deleteDestination(idSelected);
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
