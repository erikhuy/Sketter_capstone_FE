/* eslint-disable prettier/prettier */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/jsx-key */
/* eslint-disable no-const-assign */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable guard-for-in */
/* eslint-disable camelcase */

import * as Yup from 'yup';
import React, {useCallback, useEffect, useState} from 'react';
import {
	Box,
	Card,
	FormHelperText,
	Grid,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	Autocomplete,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TablePagination,
	TableRow,
	Rating
} from '@material-ui/core';
import {Icon} from '@iconify/react';
import starFilled from '@iconify/icons-ant-design/star-filled';
import {useFormik, Form, FormikProvider, validateYupSchema} from 'formik';
import {DesktopDatePicker, LoadingButton, LocalizationProvider, TimePicker} from '@material-ui/lab';
import {useLoading} from 'shared/hooks';
import {updateMeThunk} from 'shared/redux/thunks/auth';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlacesAutocomplete from 'components/placeautocomplete/PlacesAutocomplete';
import {CheckBoxIcon, CheckBoxOutlineBlankIcon} from '@material-ui/icons/CheckBox';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import ImageDropzone from 'components/imagearea/ImageDropzone';
import PropTypes from 'prop-types';
import Mapfield from 'components/mapfield';
import axios from 'axios';
import {API_URL} from 'shared/constants';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import imgbbUploader from 'imgbb-uploader/lib/cjs';
import {useSnackbar} from 'notistack5';
import Scrollbar from 'components/Scrollbar';
import SortingSelectingHead from './SortingSelectingHead';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
ReviewList.propTypes = {
	destinationID: PropTypes.object.isRequired
};

export default function ReviewList({destinationID}) {
	// eslint-disable-next-line no-bitwise
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState('asc');
	const [orderBy, setOrderBy] = useState('name');
	const [dataNumber, setDataNumber] = useState();
	const [currentPage, setCurrentPage] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const UpdateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Tên không hợp lệ!').max(50, 'Tên không hợp lệ!').required('Yêu cầu nhập tên')
	});

	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdateDestinationSchema,
		initialValues: data
		// onSubmit: async (values, {setErrors, setSubmitting}) => {
		// 	console.log(values.location);
		// 	console.log(values);
		// 	try {
		// 		await updateDestination(processData(values));
		// 		if (isMountedRef.current) {
		// 			setSubmitting(false);
		// 		}
		// 	} catch (error) {
		// 		if (isMountedRef.current) {
		// 			setErrors({afterSubmit: error.message});
		// 			setSubmitting(false);
		// 			setCreateDestinationMessage(null);
		// 		}
		// 	}
		// }
	});

	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axios
					.get(`${API_URL.Destination}/${destinationID}/rating?page=1`)
					.then((res) => {
						console.log(res.data.data.rating);
						setData(res.data.data.rating);
						setCurrentPage(res.data.currentPage);
						if (res.data.maxPage > res.data.currentPage) {
							// eslint-disable-next-line no-const-assign
							setDataNumber(
								res.data.data.rating.travelerRating.length + page * 10 + (page === 0 ? 1 : page)
							);
						} else {
							setDataNumber(res.data.data.rating.travelerRating.length + page * 10);
						}
						setBusy(false);
					})
					.catch((e) => {
						console.log(e.response.data);
						// enqueueSnackbar(e.response.data.message, {variant: 'error'});
					});
			} catch (error) {
				setPage(page - 1);
			}
		};
		fetchSupplier();
	}, []);

	const TABLE_HEAD = [
		{
			id: 'name',
			numeric: false,
			disablePadding: true,
			label: 'Tên'
		},
		{
			id: 'description',
			numeric: false,
			disablePadding: false,
			label: 'Miêu tả'
		},
		{
			id: 'star',
			numeric: false,
			disablePadding: false,
			label: 'Đánh giá'
		}
	];

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.travelerRating.length) : 0;

	const {errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, values} = formik;
	return (
		<>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					{isBusy ? (
						<h1 className="page-title text-center font-weight-bold">Đang tải . . .</h1>
					) : (
						<Card sx={{p: 3}}>
							<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
								<h1 className="page-title text-center font-weight-bold">Chi tiết đánh giá</h1>
							</Box>
							<Grid container>
								<Grid item xs={12}>
									<Stack direction={{xs: 'column'}} spacing={2}>
										<Box sx={{mt: 3, mb: 3, display: 'flex', justifyContent: 'center'}}>
											<Stack direction={{xs: 'row'}} spacing={2}>
												<Card sx={{p: 3}}>
													<Box sx={{display: 'flex', justifyContent: 'center'}}>
														<h1>{values.avgRating}</h1>
														<Icon
															icon={starFilled}
															color="#ffe23d"
															width="40"
															height="40"
														/>
													</Box>
												</Card>
												<Card sx={{p: 3}}>
													<Typography variant="h3">{values.totalRating} đánh giá</Typography>
												</Card>
											</Stack>
										</Box>

										<Scrollbar>
											<TableContainer>
												<Table size="medium" selectablerows="single">
													<SortingSelectingHead
														order={order}
														orderBy={orderBy}
														headLabel={TABLE_HEAD}
														rowCount={data.totalRating.length}
													/>
													<TableBody>
														{data.travelerRating.map((row) => (
															<TableRow>
																<TableCell align="center">
																	{row.ratingBy.name}
																</TableCell>
																<TableCell align="center">{row.description}</TableCell>
																<TableCell align="center">
																	<Rating name="disabled" value={row.star} disabled />
																</TableCell>
															</TableRow>
														))}
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
									</Stack>
								</Grid>
							</Grid>
						</Card>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}
