/* eslint-disable prettier/prettier */
import {useNavigate} from 'react-router-dom';
import {
	Button,
	Card,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Icon,
	IconButton,
	Stack,
	TextField
} from '@material-ui/core';
import {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {API_URL} from 'shared/constants';
import {useSnackbar} from 'notistack5';
import AddIcon from '@material-ui/icons/Add';

export default function CatalogManagement() {
	const [data, setData] = useState();
	const [reload, setReload] = useState();
	const [openCatalogDialog, setOpenCatalogDialog] = useState();
	const [openAddDialog, setOpenAddDialog] = useState();
	const [selectedCatalog, setSelectedCatalog] = useState();
	const [mainCatalog, setMainCatalog] = useState();
	const [subCatalog, setSubCatalog] = useState();
	const [status, setStatus] = useState();
	const handleOpenCatalogDialog = (catalog, sentStatus) => {
		console.log(catalog, sentStatus);
		setOpenCatalogDialog(true);
		setSelectedCatalog(catalog);
		setStatus(sentStatus);
	};
	const handleOpenAddDialog = (mainCatalog) => {
		console.log(mainCatalog);
		setOpenAddDialog(true);
		setMainCatalog(mainCatalog);
	};
	const handleCatalogCloseDialog = () => setOpenCatalogDialog(false);
	const handleCloseAddDialog = () => setOpenAddDialog(false);

	const {enqueueSnackbar} = useSnackbar();

	const [chipData, setChipData] = useState([
		{key: 0, label: 'Angular'},
		{key: 1, label: 'jQuery'},
		{key: 2, label: 'Polymer'},
		{key: 3, label: 'Vue.js'}
	]);

	const catalogAction = useCallback(async (catalog, status) => {
		try {
			console.log(catalog, status);
			// eslint-disable-next-line no-restricted-globals, no-global-assign
			await axios
				.patch(`${API_URL.Cata}/${catalog}?action=${status}`)
				.then((res) => {
					console.log(res.data);
					// eslint-disable-next-line no-useless-concat
					enqueueSnackbar(`${status === 'enable' ? 'Kích hoạt' : 'Xóa'} loại địa điểm thành công`, {
						variant: 'success'
					});
					setReload(res.data);
					setOpenCatalogDialog(false);
				})
				.catch((error) => enqueueSnackbar(error.data.message, {variant: 'error'}));
		} catch (e) {
			enqueueSnackbar('Xóa loại địa điểm không thành công', {variant: 'error'});
			setOpenCatalogDialog(false);
		}
	}, []);
	const addCatalog = useCallback(async (mainCatalog, subCatalog) => {
		try {
			console.log(mainCatalog, subCatalog);
			// eslint-disable-next-line no-restricted-globals, no-global-assign
			await axios
				.post(`${API_URL.Cata}`, {name: subCatalog, parent: mainCatalog})
				.then((res) => {
					console.log(res.data);
					// eslint-disable-next-line no-useless-concat
					enqueueSnackbar('Thêm loại địa điểm thành công', {
						variant: 'success'
					});
					setReload(res.data);
					setOpenCatalogDialog(false);
				})
				.catch((error) => enqueueSnackbar(error.data.message, {variant: 'error'}));
		} catch (e) {
			enqueueSnackbar('Thêm loại địa điểm không thành công', {variant: 'error'});
			setOpenAddDialog(false);
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
			{openCatalogDialog && (
				<Dialog
					open={openCatalogDialog}
					onClose={handleCatalogCloseDialog}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">
						{status === 'enable' ? 'Kích hoạt' : 'Xóa'} loại địa điểm ?
					</DialogTitle>
					<DialogActions>
						<Button onClick={handleCatalogCloseDialog}>Hủy</Button>
						<Button onClick={() => catalogAction(selectedCatalog, status)}>Đồng ý</Button>
					</DialogActions>
				</Dialog>
			)}
			{openAddDialog && (
				<Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
					<DialogTitle>Thêm địa điểm phụ vào {mainCatalog}</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Email Address"
							type="email"
							fullWidth
							variant="standard"
							onChange={(value) => {
								setSubCatalog(value.target.value);
							}}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseAddDialog}>Hủy</Button>
						<Button onClick={() => addCatalog(mainCatalog, subCatalog)}>Tạo</Button>
					</DialogActions>
				</Dialog>
			)}
			{data?.map((value) => (
				// eslint-disable-next-line react/jsx-key
				<div>
					<Card sx={{p: 3, m: 3}}>
						<h3>{value.name}</h3>
						<Stack direction="row" spacing={1} sx={{mt: 2}}>
							{value.sub?.map((subCatalog, index) => (
								// eslint-disable-next-line react/jsx-key
								<div>
									<Chip
										color={subCatalog.deletedAt == null ? 'success' : 'secondary'}
										label={subCatalog.name}
										onDelete={() =>
											handleOpenCatalogDialog(
												subCatalog.name,
												subCatalog.deletedAt == null ? 'disable' : 'enable'
											)
										}
									/>

									{value.sub.length - 1 === index ? (
										<IconButton sx={{p: 0,ml: 2}}
											onClick={() => {
												handleOpenAddDialog(value.name);
											}}
										>
											<AddIcon />
										</IconButton>
									) : null}
								</div>
							))}
						</Stack>
					</Card>
				</div>
			))}
		</div>
	);
}
