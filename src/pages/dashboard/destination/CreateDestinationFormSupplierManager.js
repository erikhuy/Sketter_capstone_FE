/* eslint-disable prettier/prettier */
/* eslint-disable no-sequences */
/* eslint-disable no-const-assign */
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
	Chip
} from '@material-ui/core';
import axios from 'axios';
import {useFormik, Form, FormikProvider} from 'formik';
import {DesktopDatePicker, LoadingButton, LocalizationProvider, TimePicker} from '@material-ui/lab';
import {useLoading} from 'shared/hooks';
import {updateMeThunk} from 'shared/redux/thunks/auth';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlacesAutocomplete from 'components/placeautocomplete/PlacesAutocomplete';
import {CheckBoxIcon, CheckBoxOutlineBlankIcon} from '@material-ui/icons/CheckBox';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import ImageDropzone from 'components/imagearea/ImageDropzone';
import PropTypes from 'prop-types';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import {createNull} from 'typescript';
import Mapfield from 'components/mapfield';
import {API_URL} from 'shared/constants';
import {useSnackbar} from 'notistack5';
import {isNull} from 'lodash';
import {useNavigate} from 'react-router-dom';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const imgbbUploader = require('imgbb-uploader');

export default function CreateDestinationFormSupplierManager() {
	// eslint-disable-next-line no-bitwise
	const [registerDate, setRegisterDate] = useState(new Date());
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const [gallery, setGallery] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [createDestinationMessage, setCreateDestinationMessage] = useState();

	const CreateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Tên không hợp lệ!').max(50, 'Tên không hợp lệ!').required('Yêu cầu nhập tên'),
		// address: Yup.string().min(5, 'Địa chỉ không hợp lệ').required('Yêu cầu nhập địa chỉ'),
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(8, 'Số điện thoại không tồn tại!')
			.max(13, 'Số điện thoại không tồn tại!')
			.required('Yêu cầu nhập số điện thoại'),
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
		lowestPrice: Yup.number().integer().min(10).required('Yêu cầu giá thấp nhất'),
		highestPrice: Yup.number()
			.integer()
			.min(Yup.ref('lowestPrice'), 'Giá phải cao hơn giá thấp nhất')
			.required('Yêu cầu giá cao nhất'),
		catalogs: Yup.array().min(1, 'Yêu cầu loại địa điểm'),
		destinationPersonalities: Yup.array().min(1, 'Yêu cầu tính cách du lịch'),
		openingTime: Yup.string().nullable(true, 'Thời gian không được trống').required('Yêu cầu thời gian mở cửa'),
		supplierID: Yup.string().required('Yêu cầu chọn đối tác'),
		closingTime: Yup.string()
			.nullable(true, 'Thời gian không được trống')
			.required('Yêu cầu thời gian đóng cửa')
			.notOneOf([Yup.ref('openingTime')], 'Thời gian mở cửa không hợp lệ'),

		estimatedTimeStay: Yup.number()
			.min(0, 'Thời gian không hợp lệ!')
			.max(1440, 'Thời gian không quá 1 ngày!')
			.required('Yêu cầu thời gian dự kiến ở lại'),
		recommendedTimes: Yup.array().min(1, 'Khoảng thời gian lý tưởng không được trống')
	});
	const formik = useFormik({
		initialValues: {
			name: '',
			address: '',
			longitude: '',
			latitude: '',
			location: null,
			phone: '',
			email: '',
			description: '',
			supplierID: '',
			lowestPrice: '',
			highestPrice: '',
			openingTimeSup: null,
			openingTime: null,
			closingTimeSup: null,
			closingTime: null,
			estimatedTimeStay: '',
			recommendedTimes: [],
			destinationPersonalities: [],
			catalogs: [],
			images: []
		},
		validationSchema: CreateDestinationSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			// handleImageBB(getFieldProps('images'));
			console.log(values);

			try {
				// processData(values);
				await createDestination(processData(values));
				if (isMountedRef.current) {
					setSubmitting(false);
				}
			} catch (error) {
				if (isMountedRef.current) {
					setErrors({afterSubmit: error.message});
					setSubmitting(false);
					setCreateDestinationMessage(null);
				}
			}
		}
	});
	const processData = (data) => {
		console.log(data.location);
		const supArray = data;
		supArray.longitude = data.location.lng;
		supArray.latitude = data.location.lat;
		supArray.address = data.location.destinationAddress;

		return supArray;
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios.get(`${API_URL.User}/supplier`).then((res) => {
					if (res.status === 200) {
						console.log(res.data.data.suppliers);
						setSuppliers(res.data.data.suppliers);
					}
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchData();
	}, []);
	useEffect(() => {
		if (!createDestinationMessage) {
			return;
		}
		const message = createDestinationMessage;
		if (message === 'success') {
			enqueueSnackbar('Tạo địa điểm thành công', {variant: 'success'});
		} else {
			enqueueSnackbar(message, {variant: createDestinationMessage ? 'error' : 'success'});
		}
	}, [createDestinationMessage]);

	const navigate = useNavigate();

	const navigateToViewDestination = () => {
		navigate('/dashboard/destinationList');
	};
	const createDestination = useCallback(async (data) => {
		console.log(data);
		try {
			await axios.post(`${API_URL.Destination}`, data).then((res) => {
				setCreateDestinationMessage(res.data.message);
				console.log(res.data);
			});
		} catch (e) {
			console.log(e.response.data.message);
			setCreateDestinationMessage(e.response.data.message);
		}
	});

	const handleImages = (data) => {
		setGallery(data);
		const imageArray = [];
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			try {
				imgbbUploader({
					apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
					base64string: images.image_base64.split('base64,')[1]
					// OPTIONAL: pass base64-encoded image (max 32Mb)
				})
					.then((response) => imageArray.push({url: response.url}))
					.catch((error) => setCreateDestinationMessage(error));
			} catch (e) {
				console.log(e);
			}
		});
		setFieldValue('images', imageArray);
	};

	const handleOpeningTime = (data) => {
		setFieldValue('openingTimeSup', data);
		setFieldValue('openingTime', data.toString().substr(16, 5));
	};
	const handleClosingTime = (data) => {
		setFieldValue('closingTimeSup', data);
		setFieldValue('closingTime', data.toString().substr(16, 5));
	};
	const handleRecommendedTime = (data) => {
		// setFieldValue('destinationPersonalities', value !== null ? value : initialValues.destinationPersonalities);
		console.log(data);
	};
	const {errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, values} = formik;
	return (
		<>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Card sx={{p: 3}}>
						<h1 className="page-title text-center font-weight-bold">Trang nhập liệu</h1>
						<Grid container>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
									<TextField
										fullWidth
										label="Tên địa điểm*"
										{...getFieldProps('name')}
										error={Boolean(touched.name && errors.name)}
										helperText={touched.name && errors.name}
									/>
									<TextField
										fullWidth
										label="Số điện thoại*"
										{...getFieldProps('phone')}
										error={Boolean(touched.phone && errors.phone)}
										helperText={touched.phone && errors.phone}
									/>
									<TextField
										fullWidth
										label="Email*"
										{...getFieldProps('email')}
										error={Boolean(touched.email && errors.email)}
										helperText={touched.email && errors.email}
									/>
									<TextField
										fullWidth
										multiline
										label="Thông tin địa điểm"
										rows={22}
										{...getFieldProps('description')}
										error={Boolean(touched.description && errors.description)}
										helperText={touched.description && errors.description}
									/>
									<Autocomplete
										onChange={(e, value) => {
											console.log(value.id);
											setFieldValue(
												'supplierID',
												value !== null ? value.id : initialValues.supplierID
											);
										}}
										id="tags-outlined"
										options={suppliers}
										getOptionLabel={(option) => `${option.email}-${option.name}`}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												label="Supplier"
												{...getFieldProps('supplierID')}
												required
												error={Boolean(touched.supplierID && errors.supplierID)}
												helperText={touched.supplierID && errors.supplierID}
											/>
										)}
									/>
									<Stack direction={{xs: 'row'}} spacing={2}>
										<TextField
											type="number"
											{...getFieldProps('lowestPrice')}
											style={{height: 56, width: 360}}
											label={<span className="labelText">Giá thấp nhất*</span>}
											InputLabelProps={{
												shrink: true,
												placeholder: '1000-10000'
											}}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vnđ</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.lowestPrice && errors.lowestPrice)}
											helperText={touched.lowestPrice && errors.lowestPrice}
										/>
										<div>-</div>
										<TextField
											type="number"
											{...getFieldProps('highestPrice')}
											style={{height: 56, width: 360}}
											label={<span className="labelText">Giá cao nhất*</span>}
											InputLabelProps={{
												shrink: true,
												className: 'labelText2',
												placeholder: '1000-10000'
											}}
											InputProps={{
												className: 'text-field-style',

												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vnđ</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.highestPrice && errors.highestPrice)}
											helperText={touched.highestPrice && errors.highestPrice}
										/>
									</Stack>
								</Stack>
							</Grid>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
									{/* <TextField
										fullWidth
										label="Địa chỉ*"
										{...getFieldProps('address')}
										error={Boolean(touched.address && errors.address)}
										helperText={touched.address && errors.address}
									/>
									<TextField
										fullWidth
										type="number"
										label="Kinh độ*"
										{...getFieldProps('longitude')}
										error={Boolean(touched.longitude && errors.longitude)}
										helperText={touched.longitude && errors.longitude}
									/>
									<TextField
										fullWidth
										label="Vĩ độ*"
										type="number"
										{...getFieldProps('latitude')}
										error={Boolean(touched.latitude && errors.latitude)}
										helperText={touched.latitude && errors.latitude}
									/> */}
									<Mapfield name="location" label="Địa chỉ" placeholder="Chọn địa điểm" />
									<Box
										sx={{
											height: 15
										}}
									/>
									<h2>Thông tin về phân loại</h2>
									<h3 className="category-label">Loại địa điểm</h3>
									<Autocomplete
										onChange={(e, value) => {
											setFieldValue('catalogs', value !== null ? value : initialValues.catalogs);
										}}
										multiple
										id="tags-outlined"
										options={catalog}
										getOptionLabel={(option) => option}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												{...getFieldProps('catalogs')}
												label="Loại địa điểm"
												required
												error={Boolean(touched.catalogs && errors.catalogs)}
												helperText={touched.catalogs && errors.catalogs}
											/>
										)}
									/>
									<h3 className="category-label">Tính cách du lịch người dùng</h3>
									<Autocomplete
										multiple
										id="tags-outlined"
										options={TravelPersonalityTypes}
										getOptionLabel={(option) => option}
										onChange={(e, value) => {
											setFieldValue(
												'destinationPersonalities',
												value !== null ? value : initialValues.destinationPersonalities
											);
										}}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												multiline="false"
												required
												{...params}
												{...getFieldProps('destinationPersonalities')}
												label="Loại tính cách"
												error={Boolean(
													touched.destinationPersonalities && errors.destinationPersonalities
												)}
												helperText={
													touched.destinationPersonalities && errors.destinationPersonalities
												}
											/>
										)}
									/>
									<h3>Thông tin về thời gian</h3>
									<Stack direction={{xs: 'column'}} spacing={5} sx={{m: 2}}>
										<Stack direction={{xs: 'row'}} spacing={2}>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<TimePicker
													ampm={false}
													views={['hours', 'minutes']}
													label={<span className="labelText">Thời gian mở cửa*</span>}
													value={values.openingTimeSup}
													// onChange={(value) => setFieldValue('openingTime', value.toString().substr(16, 5))}
													onChange={(value) => handleOpeningTime(value)}
													maxTime={values.closingTimeSup}
													renderInput={(params) => (
														<TextField
															{...params}
															style={{height: 56, width: 410}}
															{...getFieldProps('openingTime')}
															error={Boolean(touched.openingTime && errors.openingTime)}
															helperText={touched.openingTime && errors.openingTime}
														/>
													)}
												/>
											</LocalizationProvider>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<TimePicker
													ampm={false}
													label={<span className="labelText">Thời gian đóng cửa*</span>}
													value={values.closingTimeSup}
													minTime={values.openingTimeSup}
													onChange={(value) => handleClosingTime(value)}
													renderInput={(params) => (
														<TextField
															{...params}
															style={{height: 56, width: 410}}
															{...getFieldProps('closingTime')}
															error={Boolean(touched.closingTime && errors.closingTime)}
															helperText={touched.closingTime && errors.closingTime}
														/>
													)}
												/>
											</LocalizationProvider>
										</Stack>
										<TextField
											{...getFieldProps('estimatedTimeStay')}
											required
											type="number"
											className="form-control"
											style={{height: 56, width: 740}}
											label={<span className="labelText">Thời gian dự kiến ở lại</span>}
											InputProps={{
												className: 'text-field-style',
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">min</span>
													</InputAdornment>
												),
												startAdornment: (
													<InputAdornment position="start">
														<AccessTimeIcon />
													</InputAdornment>
												)
											}}
											error={Boolean(touched.estimatedTimeStay && errors.estimatedTimeStay)}
											helperText={touched.estimatedTimeStay && errors.estimatedTimeStay}
										/>
										<Autocomplete
											multiple
											id="tags-outlined"
											options={RecommendedTimesFrame}
											getOptionLabel={(option) => `${option.start}-${option.end}`}
											onChange={(e, value) => {
												setFieldValue(
													'recommendedTimes',
													value !== null ? value : initialValues.recommendedTimes
												);
											}}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													multiline="false"
													required
													{...params}
													label="Khoảng thời gian lý tưởng"
													{...getFieldProps('recommendedTimes')}
													error={Boolean(touched.recommendedTimes && errors.recommendedTimes)}
													helperText={touched.recommendedTimes && errors.recommendedTimes}
												/>
											)}
										/>
									</Stack>
								</Stack>
							</Grid>
							<ImageDropzone setImageList={handleImages} imageList={gallery} />
						</Grid>
						<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								Tạo địa điểm
							</LoadingButton>
						</Box>
					</Card>
				</Form>
			</FormikProvider>
		</>
	);
}

// const catalog = [
// 	{name: 'Quán ăn'},
// 	{name: 'Quán cà phê'},
// 	{name: 'Địa điểm du lịch'},
// 	{name: 'Homestay'},
// 	{name: 'Khách sạn'},
// 	{name: 'Khu nghỉ dưỡng cao cấp'}
// ];
const catalog = ['Quán ăn', 'Quán cà phê', 'Địa điểm du lịch', 'Homestay', 'Khách sạn', 'Khu nghỉ dưỡng cao cấp'];
const TravelPersonalityTypes = [
	'Thích khám phá',
	'Ưa mạo hiểm',
	'Tìm kiếm sự thư giãn',
	'Đam mê với ẩm thực',
	'Đam mê với lịch sử, văn hóa',
	'Yêu thiên nhiên',
	'Giá rẻ là trên hết',
	'Có nhu cầu vui chơi, giải trí cao'
];
// const TravelPersonalityTypes = [
// 	{name: 'Thích khám phá'},
// 	{name: 'Ưa mạo hiểm'},
// 	{name: 'Tìm kiếm sự thư giãn'},
// 	{name: 'Đam mê với ẩm thực'},
// 	{name: 'Đam mê với lịch sử, văn hóa'},
// 	{name: 'Yêu thiên nhiên'},
// 	{name: 'Giá rẻ là trên hết'},
// 	{name: 'Có nhu cầu vui chơi, giải trí cao'}
// ];
const RecommendedTimesFrame = [
	{
		start: '04:00',
		end: '07:00'
	},
	{
		start: '07:00',
		end: '09:00'
	},
	{
		start: '09:00',
		end: '12:00'
	},
	{
		start: '12:00',
		end: '15:00'
	},
	{
		start: '15:00',
		end: '18:00'
	},
	{
		start: '18:00',
		end: '21:00'
	}
];
