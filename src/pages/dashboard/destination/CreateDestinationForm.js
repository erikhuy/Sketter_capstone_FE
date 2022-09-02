/* eslint-disable prettier/prettier */
/* eslint-disable no-const-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable guard-for-in */

/* eslint-disable camelcase */

import * as Yup from 'yup';
import React, {useEffect, useState} from 'react';
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
import {values} from 'lodash';
import {createNull} from 'typescript';
import Mapfield from 'components/mapfield';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const imgbbUploader = require('imgbb-uploader');

export default function CreateDestinationForm() {
	// eslint-disable-next-line no-bitwise
	const [registerDate, setRegisterDate] = useState(new Date());
	const isMountedRef = useIsMountedRef();

	const [gallery, setGallery] = useState([]);

	const CreateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Quá ngắn!').max(50, 'Quá dài!').required('Yêu cầu nhập tên'),
		address: Yup.string().min(5, 'Địa chỉ không hợp lệ').required('Yêu cầu nhập địa chỉ'),
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(7, 'Quá ngắn!')
			.max(13, 'Quá dài!')
			.required('Yêu cầu nhập số điện thoại'),
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
		lowestPrice: Yup.number().integer().min(1000).required('Yêu cầu giá thấp nhất'),
		highestPrice: Yup.number()
			.integer()
			.min(Yup.ref('lowestPrice'), 'Giá phải cao hơn giá thấp nhất')
			.required('Yêu cầu giá thấp nhất'),
		catalogs: Yup.array().min(1, 'Yêu cầu loại địa điểm')
	});
	const formik = useFormik({
		initialValues: {
			name: '',
			address: '',
			longitude: 0,
			latitude: 0,
			phone: '',
			email: '',
			description: '',
			lowestPrice: '',
			highestPrice: '',
			openingTime: null,
			closingTime: null,
			estimatedTimeStay: 0,
			recommendedTimes: [
				{
					start: '',
					end: ''
				}
			],
			personalityTypes: [],
			catalogs: [],
			images: [
				{
					url: ''
				}
			]
		},
		validationSchema: CreateDestinationSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			handleImageBB(getFieldProps('images'));
			try {
				if (isMountedRef.current) {
					console.log(values);
					setSubmitting(false);
				}
			} catch (error) {
				if (isMountedRef.current) {
					setErrors({afterSubmit: error.message});
					setSubmitting(false);
				}
			}
		}
	});

	const handleImageBB = (data) => {
		// console.log(data.value)
		// data.value.map((num) => console.log(num.url));
		const imgGallery = [];
		data.value.map(
			// eslint-disable-next-line array-callback-return
			(images) => {
				try {
					imgbbUploader({
						apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
						base64string: images.url.split('base64,')[1]
						// OPTIONAL: pass base64-encoded image (max 32Mb)
					})
						.then((response) => imgGallery.push({url: response.url}))
						.catch((error) => console.error(error));
				} catch (e) {
					console.log(e);
				}
			}
		);
		setFieldValue('images', imgGallery);
		console.log(getFieldProps('images'));
	};

	const handleImages = (data) => {
		setGallery(data);
		const imageArray = data.map((image_url) => ({
			url: image_url.image_base64
		}));
		setFieldValue('images', imageArray);
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
										label="Tên địa điểm"
										{...getFieldProps('name')}
										error={Boolean(touched.name && errors.name)}
										helperText={touched.name && errors.name}
									/>
									<TextField
										fullWidth
										label="Số điện thoại"
										{...getFieldProps('phone')}
										error={Boolean(touched.phone && errors.phone)}
										helperText={touched.phone && errors.phone}
									/>
									<TextField
										fullWidth
										label="Email"
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

									<Stack direction={{xs: 'row'}} spacing={2}>
										<TextField
											{...getFieldProps('lowestPrice')}
											style={{height: 56, width: 360}}
											label={<span className="labelText">Giá thấp nhất</span>}
											InputLabelProps={{
												shrink: true,
												placeholder: '1000-10000'
											}}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">vnđ</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.lowestPrice && errors.lowestPrice)}
											helperText={touched.lowestPrice && errors.lowestPrice}
										/>
										<div>-</div>
										<TextField
											{...getFieldProps('highestPrice')}
											style={{height: 56, width: 360}}
											label={<span className="labelText">Giá cao nhất</span>}
											InputLabelProps={{
												shrink: true,
												className: 'labelText2',
												placeholder: '1000-10000'
											}}
											InputProps={{
												className: 'text-field-style',

												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">vnđ</span>
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
								<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2, display: 'flex'}}>
									<Mapfield name="addrress" label="Địa chỉ" placeholder="Chọn địa điểm" />
									<Box
										sx={{
											height: 15
										}}
									/>
									<h2>Thông tin về phân loại</h2>
									<h3 className="category-label">Catalog</h3>
									<Stack spacing={3}>
										<Autocomplete
											onChange={(e, value) => {
												setFieldValue(
													'catalogs',
													value !== null ? value : initialValues.catalogs
												);
											}}
											multiple
											id="tags-outlined"
											options={catalog}
											getOptionLabel={(option) => option.name}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField {...params} label="Loại địa điểm" required />
											)}
										/>
										<h3 className="category-label">Tính cách du lịch người dùng</h3>
										<Autocomplete
											multiple
											id="tags-outlined"
											options={TravelPersonalityTypes}
											getOptionLabel={(option) => option.name}
											onChange={(e, value) => {
												setFieldValue(
													'personalityTypes',
													value !== null ? value : initialValues.personalityTypes
												);
											}}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													multiline="false"
													required
													{...params}
													label="Loại tính cách"
												/>
											)}
										/>
									</Stack>
									<h3>Thông tin về thời gian</h3>
									<Stack direction={{xs: 'row'}} spacing={2}>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												ampm={false}
												label={<span className="labelText">Thời gian mở cửa</span>}
												value={values.openingTime}
												onChange={(value) => setFieldValue('openingTime', value)}
												maxTime={getFieldProps('closingTime')}
												renderInput={(params) => (
													<TextField {...params} style={{height: 56, width: 410}} />
												)}
											/>
										</LocalizationProvider>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												ampm={false}
												label={<span className="labelText">Thời gian đóng cửa</span>}
												value={values.closingTime}
												minTime={getFieldProps('openingTime')}
												onChange={(value) => setFieldValue('closingTime', value)}
												renderInput={(params) => (
													<TextField {...params} style={{height: 56, width: 410}} />
												)}
											/>
										</LocalizationProvider>
									</Stack>
									<Stack direction={{xs: 'row'}} spacing={2}>
										<TextField
											{...getFieldProps('estimatedTimeStay')}
											name="spendingTime"
											required
											className="form-control"
											style={{height: 56, width: 410}}
											label={<span className="labelText">Thời gian dự kiến ở lại</span>}
											InputLabelProps={{
												shrink: true,
												className: 'labelText2'
											}}
											InputProps={{
												className: 'text-field-style',
												placeholder: '10',
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
										/>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DesktopDatePicker
												readOnly
												label={<span className="labelText">Ngày đăng ký</span>}
												inputFormat="dd/MM/yyyy"
												value={registerDate}
												onChange={(newValue) => {
													setRegisterDate(newValue);
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														{...getFieldProps('estimatedTimeStay')}
														name="authorized_day"
														style={{height: 56, width: 410}}
														InputLabelProps={{
															shrink: true,
															className: 'labelText2'
														}}
													/>
												)}
											/>
										</LocalizationProvider>
									</Stack>

									<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
										<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
											Tạo địa điểm
										</LoadingButton>
									</Box>
								</Stack>
							</Grid>
							<ImageDropzone setImageList={handleImages} imageList={gallery} />
						</Grid>
					</Card>
				</Form>
			</FormikProvider>
		</>
	);
}

const catalog = [
	{name: 'Quán ăn'},
	{name: 'Quán cà phê'},
	{name: 'Địa điểm du lịch'},
	{name: 'Homestay'},
	{name: 'Khách sạn'},
	{name: 'Khu nghỉ dưỡng cao cấp'}
];

const TravelPersonalityTypes = [
	{name: 'Thích khám phá'},
	{name: 'Ưa mạo hiểm'},
	{name: 'Tìm kiếm sự thư giãn'},
	{name: 'Đam mê với ẩm thực'},
	{name: 'Đam mê với lịch sử, văn hóa'},
	{name: 'Yêu thiên nhiên'},
	{name: 'Giá rẻ là trên hết'},
	{name: 'Có nhu cầu vui chơi, giải trí cao'}
];
