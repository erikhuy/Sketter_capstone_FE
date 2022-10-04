/* eslint-disable prettier/prettier */
import {useNavigate} from 'react-router-dom';
import {Button, Card, Chip, Dialog, DialogActions, DialogTitle, ListItem} from '@material-ui/core';
import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL} from 'shared/constants';
import {useSnackbar} from 'notistack5';

export default function CatalogManagement() {
	const [data, setData] = useState();
	const [reload, setReload] = useState();
	const [openDialog, setOpenDialog] = useState();
	const [selectedCatalog, setSelectedCatalog] = useState();
	const [status, setStatus] = useState();
	const handleOpenDialog = (catalog, sentStatus) => {
		setOpenDialog(true);
		setSelectedCatalog(catalog);
		setStatus(sentStatus);
	};
	const handleCloseDialog = () => setOpenDialog(false);
	const {enqueueSnackbar} = useSnackbar();

	const [chipData, setChipData] = useState([
		{key: 0, label: 'Angular'},
		{key: 1, label: 'jQuery'},
		{key: 2, label: 'Polymer'},
		{key: 3, label: 'Vue.js'}
	]);
	const handleDelete = (chipToDelete) => () => {
		setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
	};

	const catalogAction = useCallback(async (catalog, status) => {
		try {
			console.log(catalog, status);
			// eslint-disable-next-line no-restricted-globals, no-global-assign
			await axios
				.patch(`${API_URL.Cata}/${catalog}?action=${status}`)
				.then((res) => {
					console.log(res.data);
					enqueueSnackbar('Xóa loại địa điểm thành công', {variant: 'success'});
					setReload('');
					setOpenDialog(false);
				})
				.catch((error) => enqueueSnackbar(error.data.message, {variant: 'error'}));
		} catch (e) {
			enqueueSnackbar('Xóa loại địa điểm không thành công', {variant: 'error'});
			setOpenDialog(false);
		}
	}, []);
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios.get(`${API_URL.Cata}`).then((res) => {
					console.log(res.data.data.catalogs);
					setData(res.data.data.catalogs);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [reload]);
	return (
		<div>
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
						<Button onClick={() => catalogAction()}>Đồng ý</Button>
					</DialogActions>
				</Dialog>
			)}
			{data?.map((value) => (
				// eslint-disable-next-line react/jsx-key
				<div>
					<h3>{value.name}</h3>
					{value.sub?.map((subCatalog) => (
						// eslint-disable-next-line react/jsx-key
						<Chip
							color="success"
							label={subCatalog.name}
							onDelete={() => catalogAction(subCatalog.name, 'disable')}
						/>
					))}
				</div>
			))}
		</div>
	);
}
