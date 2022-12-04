/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable camelcase */
// material
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	TextField
} from '@material-ui/core';
import axios from 'axios';
import {useCallback, useEffect, useState} from 'react';
import {API_URL} from 'shared/constants';
// components
import {Icon} from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import {useSnackbar} from 'notistack5';
import Clear from '@material-ui/icons/Clear';
import axiosInstance from 'utils/axios';
import Scrollbar from '../../../../../components/Scrollbar';
//
import SortingSelectingHead from './SortingSelectingHead';
import SortingSelectingToolbar from './SortingSelectingToolbar';
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

export default function PromotionSortingSelecting() {
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('name');
	const [selected, setSelected] = useState([]);
	const [selectedID, setSelectedID] = useState([]);
	const [page, setPage] = useState(0);
	const [dense, setDense] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [reloadList, setReloadList] = useState();
	const [data, setData] = useState([]);
	const [dataNumber, setDataNumber] = useState();
	const [maxPage, setMaxPage] = useState();
	const [currentPage, setCurrentPage] = useState();
	const [searchInput, setSearchInput] = useState('');
	const [searchKey, setSearchKey] = useState('');
	const {enqueueSnackbar} = useSnackbar();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await axiosInstance.get(`${API_URL.Voucher}`).then((res) => {
					console.log(dataNumber);

					setData(res.data.vouchers);
					setMaxPage(res.maxPage);
					setCurrentPage(res.currentPage);
					if (res.maxPage > res.currentPage) {
						// eslint-disable-next-line no-const-assign
						setDataNumber(res.data.count);
					} else {
						setDataNumber(res.data.count);
					}
				});
			} catch (error) {
				setPage(page - 1);
			}
		};
		fetchData();
	}, [page, selectedID, searchKey, reloadList]);
	useEffect(() => {
		setSelectedID([]);
	}, [reloadList]);

	const TABLE_HEAD = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'Tên'
		},
		{
			id: 'destinationName',
			numeric: true,
			disablePadding: false,
			label: 'Địa điểm'
		},
		{
			id: 'address',
			numeric: true,
			disablePadding: false,
			label: 'Địa chỉ'
		},
		{
			id: 'amount',
			numeric: true,
			disablePadding: false,
			label: 'Số lượng'
		},
		{
			id: 'Trạng_thái',
			numeric: true,
			disablePadding: false,
			label: 'Trạng thái'
		}
	];

	// ----------------------------------------------------------------------
	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = data.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, data) => {
		const selectedIndex = selected.indexOf(data.name);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, data.name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		const selectedIDIndex = selectedID.indexOf(data.id);
		let newSelectedID = [];

		if (selectedIDIndex === -1) {
			newSelectedID = newSelectedID.concat(selectedID, data.id);
		} else if (selectedIDIndex === 0) {
			newSelectedID = newSelectedID.concat(selectedID.slice(1));
		} else if (selectedIDIndex === selectedID.length - 1) {
			newSelectedID = newSelectedID.concat(selectedID.slice(0, -1));
		} else if (selectedIDIndex > 0) {
			newSelectedID = newSelectedID.concat(
				selectedID.slice(0, selectedIDIndex),
				selectedIDIndex.slice(selectedIDIndex + 1)
			);
		}
		setSelected(newSelected);
		setSelectedID(newSelectedID);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	// Avoid a layout jump when reaching the last page with empty data.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

	return (
		<>
			{/* <TextField
				fullWidth
				value={searchInput}
				placeholder="Search post..."
				sx={{
					'& fieldset': {
						borderRadius: '16px'
					}
				}}
				onChange={(e) => {
					setSearchInput(e.target.value);
				}}
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						setSearchKey(e.target.value);
						setPage(0);
					}
				}}
				InputProps={{
					startAdornment: (
						<>
							<InputAdornment position="start">
								<Box
									component={Icon}
									icon={searchFill}
									sx={{
										ml: 1,
										width: 20,
										height: 20,
										color: 'text.disabled'
									}}
								/>
							</InputAdornment>
						</>
					),
					endAdornment: (
						<IconButton
							sx={{visibility: searchInput ? 'visible' : 'hidden'}}
							onClick={() => {
								setSearchInput('');
								setSearchKey('');
								setPage(0);
							}}
						>
							<Clear />
						</IconButton>
					)
				}}
			/> */}
			<SortingSelectingToolbar
				numSelected={selected}
				idSelected={selectedID}
				reloadData={setSelectedID}
				reloadNumber={setSelected}
				onReloadList={setReloadList}
			/>

			<Scrollbar>
				<TableContainer sx={{minWidth: 800}}>
					<Table size={dense ? 'small' : 'medium'} selectablerows="single">
						<SortingSelectingHead
							order={order}
							orderBy={orderBy}
							headLabel={TABLE_HEAD}
							numSelected={selected.length}
							onRequestSort={handleRequestSort}
							rowCount={data.length}
							onSelectAllClick={handleSelectAllClick}
						/>
						<TableBody>
							{stableSort(data, getComparator(order, orderBy)).map((row, index) => {
								const isItemSelected = isSelected(row.name);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
									>
										<TableCell padding="checkbox">
											<Checkbox checked={isItemSelected} />
										</TableCell>
										<TableCell component="th" id={labelId} scope="row" padding="none">
											{row.name}
										</TableCell>
										<TableCell align="left">{row.destinationApply.name}</TableCell>
										<TableCell align="left">{row.destinationApply.address}</TableCell>
										<TableCell align="left">
											{row.totalSold}/{row.quantity}
										</TableCell>
										<TableCell align="left">
											{row.status === 'Draft' ? (
												<Button size="small" variant="contained" sx={{color: '#ffffff'}}>
													Chưa kích hoạt
												</Button>
											) : row.status === 'Activated' ? (
												<Button
													size="small"
													variant="contained"
													color="success"
													sx={{color: '#ffffff'}}
												>
													Đang hoạt động
												</Button>
											) : row.status === 'Done' ? (
												<Button
													size="small"
													variant="contained"
													color="error"
													sx={{color: '#ffffff'}}
												>
													Hết hoạt động
												</Button>
											) : (
												''
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Scrollbar>

			<Box sx={{position: 'relative'}}>
				<TablePagination
					rowsPerPageOptions={[10]}
					component="div"
					count={dataNumber}
					rowsPerPage={10}
					page={currentPage - 1}
					onPageChange={handleChangePage}
				/>
			</Box>
		</>
	);
}
