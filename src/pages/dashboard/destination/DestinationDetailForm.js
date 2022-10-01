/* eslint-disable prettier/prettier */
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
	Chip,
	Button
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
import Mapfield from 'components/mapfield';
import axios from 'axios';
import {API_URL} from 'shared/constants';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import imgbbUploader from 'imgbb-uploader/lib/cjs';
import {useSnackbar} from 'notistack5';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
DestinationDetailForm.propTypes = {
	destinationID: PropTypes.object.isRequired
};
export default function DestinationDetailForm({destinationID}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const [valueArray, setValueArray] = useState([]);
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [createDestinationMessage, setCreateDestinationMessage] = useState();

	const UpdateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Tên không hợp lệ!').max(50, 'Tên không hợp lệ!').required('Yêu cầu nhập tên'),
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(7, 'Số điện thoại không tồn tại!')
			.max(13, 'Số điện thoại không tồn tại!')
			.required('Yêu cầu nhập số điện thoại'),
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
		lowestPrice: Yup.number().integer().min(10).required('Yêu cầu giá thấp nhất'),
		highestPrice: Yup.number()
			.integer()
			.min(Yup.ref('lowestPrice'), 'Giá phải cao hơn giá thấp nhất')
			.required('Yêu cầu giá thấp nhất'),
		catalogs: Yup.array().min(1, 'Yêu cầu loại địa điểm'),
		destinationPersonalities: Yup.array().min(1, 'Yêu cầu tính cách du lịch'),
		estimatedTimeStay: Yup.number()
			.min(0, 'Thời gian không hợp lệ!')
			.max(1440, 'Thời gian không quá 1 ngày!')
			.required('Yêu cầu thời gian dự kiến ở lại'),
		openingTime: Yup.string()
			.notOneOf([Yup.ref('closingTime')], 'Thời gian mở cửa không hợp lệ')
			.required('Yêu cầu thời gian mở cửa'),
		closingTime: Yup.string()
			.notOneOf([Yup.ref('openingTime')], 'Thời gian đóng cửa không hợp lệ')
			.required('Yêu cầu thời gian đóng cửa'),
		recommendedTimes: Yup.array().min(1, 'Khoảng thời gian lý tưởng không được trống')
	});
	const locationData = {
		location: {
			destinationAddress: null,
			lng: null,
			lat: null
		}
	};
	const processData = (data) => {
		console.log(data);
		const supArray = Object.assign(data, locationData);
		supArray.catalogs = convertToArray(data?.catalogs);
		supArray.destinationPersonalities = convertToArray(data?.destinationPersonalities);
		supArray.location.lng = data.longitude;
		supArray.location.lat = data.latitude;
		supArray.location.destinationAddress = data.address;

		return supArray;
	};
	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdateDestinationSchema,
		initialValues: data,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			console.log(values);
			try {
				await updateDestination(processData(values));
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

	const updateDestination = useCallback(async (data) => {
		console.log(data);
		try {
			await axios.patch(`${API_URL.Destination}/${data.id}`, data).then((res) => {
				if (res.data.message === 'success') {
					enqueueSnackbar('Cập nhật địa điểm thành công', {variant: 'success'});
				}
				console.log(res.data);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});

	const handleAction = useCallback(async (id) => {
		try {
			await axios.patch(`${API_URL.Destination}/pending/close?id=${id}`).then((res) => {
				if (res.data.message === 'success') {
					enqueueSnackbar(res.data.data, {variant: 'success'});
				}
				console.log(res.data);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios.get(`${API_URL.Destination}/${destinationID}`).then((res) => {
					if (res.status === 200) {
						console.log(res.data.data);
						const supArray = Object.assign(res.data.data.destination, locationData);
						supArray.location.lng = res.data.data.destination.longitude;
						supArray.location.lat = res.data.data.destination.latitude;
						supArray.location.destinationAddress = res.data.data.destination.address;
						setData(supArray);
						setBusy(false);
						setGallery(res.data.data.destination.images);
						console.log(supArray);
					}
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchData();
	}, []);

	const handleImages = (data) => {
		setGallery(data);
		const imageArray = [];
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			if (!images.url) {
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
			} else {
				imageArray.push({url: images.url});
			}
		});
		setFieldValue('images', imageArray);
	};

	const convertToArray = (data) => {
		const supData = [];
		// eslint-disable-next-line array-callback-return
		data?.map((x) => {
			if (!x.name) {
				supData.push(x);
			} else {
				supData.push(x.name);
			}
		});
		return supData;
	};
	const handleTimeToString = (data) => {
		console.log(data);
		return data?.toString().substr(16, 5);
	};
	const handleStringToTime = (data) => {
		const hms = data;
		return new Date(`1970-01-01 ${hms}`);
	};

	const {errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue, values} = formik;
	return (
		<>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					{isBusy ? (
						<h1 className="page-title text-center font-weight-bold">Đang tải . . .</h1>
					) : (
						<Card sx={{p: 3}}>
							<h1 className="page-title text-center font-weight-bold">Trang nhập liệu</h1>
							<Grid container>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
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
											rows={12}
											{...getFieldProps('description')}
											error={Boolean(touched.description && errors.description)}
											helperText={touched.description && errors.description}
										/>
										
										<Stack direction={{xs: 'row'}} spacing={2}>
											<TextField
												type="number"
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
												type="number"
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
									<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
										{/* <PlacesAutocomplete location={location} updateLocation={setLocation} /> */}
										{/* <TextField fullWidth label="Địa chỉ" {...getFieldProps('address')} />
										<TextField fullWidth label="Kinh độ" {...getFieldProps('latitude')} />
										<TextField fullWidth label="Vĩ độ" {...getFieldProps('longitude')} /> */}
										<Mapfield name="location" label="Địa chỉ" placeholder="Chọn địa điểm" />

										<Box
											sx={{
												height: 15
											}}
										/>
										<h2>Thông tin về phân loại</h2>
										<h3 className="category-label">Loại địa điểm</h3>
										<Autocomplete
											multiple
											id="tags-outlined"
											options={catalogs}
											value={convertToArray(values.catalogs)}
											getOptionLabel={(option) => option}
											filterSelectedOptions
											onChange={(event, value) => {
												setFieldValue('catalogs', value);
											}}
											renderTags={(tagValue, getTagProps) =>
												tagValue.map((option, index) => (
													<Chip label={option} {...getTagProps({index})} />
												))
											}
											renderInput={(params) => (
												<TextField
													multiline="false"
													{...params}
													{...getFieldProps('catalogs')}
													label="Loại địa điểm"
													error={Boolean(touched.catalogs && errors.catalogs)}
													helperText={touched.catalogs && errors.catalogs}
												/>
											)}
										/>
										<h3 className="category-label">Tính cách du lịch người dùng</h3>
										<Autocomplete
											multiple
											id="tags-outlined"
											options={destinationPersonalities}
											value={convertToArray(values.destinationPersonalities)}
											// defaultValue={[values.destinationPersonalities]}
											getOptionLabel={(option) => option}
											filterSelectedOptions
											onChange={(event, value) => {
												setFieldValue('destinationPersonalities', value);
											}}
											renderTags={(tagValue, getTagProps) =>
												tagValue.map((option, index) => (
													<Chip label={option} {...getTagProps({index})} />
												))
											}
											renderInput={(params) => (
												<TextField
													multiline="false"
													{...params}
													{...getFieldProps('destinationPersonalities')}
													label="Loại tính cách"
													error={Boolean(
														touched.destinationPersonalities &&
															errors.destinationPersonalities
													)}
													helperText={
														touched.destinationPersonalities &&
														errors.destinationPersonalities
													}
												/>
											)}
										/>
										<h3>Thông tin về thời gian</h3>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												ampm={false}
												views={['hours', 'minutes']}
												label={<span className="labelText">Thời gian mở cửa*</span>}
												value={handleStringToTime(values.openingTime)}
												onChange={(value) =>
													setFieldValue('openingTime', handleTimeToString(value))
												}
												renderInput={(params) => (
													<TextField
														{...params}
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
												value={handleStringToTime(values.closingTime)}
												onChange={(value) =>
													setFieldValue('closingTime', handleTimeToString(value))
												}
												renderInput={(params) => (
													<TextField
														{...params}
														{...getFieldProps('closingTime')}
														error={Boolean(touched.closingTime && errors.closingTime)}
														helperText={touched.closingTime && errors.closingTime}
													/>
												)}
											/>
										</LocalizationProvider>
										<TextField
											{...getFieldProps('estimatedTimeStay')}
											required
											type="number"
											className="form-control"
											style={{width: 510}}
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
											value={values.recommendedTimes}
											getOptionLabel={(option) => `${option.start}-${option.end}`}
											onChange={(e, value) => {
												setFieldValue('recommendedTimes', value);
											}}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													multiline="false"
													required
													{...params}
													{...getFieldProps('recommendedTimes')}
													label="Khoảng thời gian lý tưởng"
													error={Boolean(touched.recommendedTimes && errors.recommendedTimes)}
													helperText={touched.recommendedTimes && errors.recommendedTimes}
												/>
											)}
										/>
									</Stack>
								</Grid>
								<ImageDropzone setImageList={handleImages} imageList={gallery} />
							</Grid>

							<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
								<Stack direction={{xs: 'row'}} spacing={2}>
									<Button color="error" variant="contained" onClick={() => handleAction(values.id)}>
										Ngưng hoạt động
									</Button>
									<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
										Cập nhật
									</LoadingButton>
								</Stack>
							</Box>
						</Card>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}

const catalogs = [
	'Quán ăn',
	'Quán nước',
	'Địa điểm du lịch',
	'Địa điểm ngắm cảnh',
	'Nông trại',
	'Vườn hoa',
	'Cắm trại',
	'Homestay',
	'Khách sạn',
	'Khu nghỉ dưỡng cao cấp',
	'Bản xứ',
	'Lịch sử',
	'Tính ngưỡng'
];
const destinationPersonalities = [
	'Thích khám phá',
	'Ưa mạo hiểm',
	'Tìm kiếm sự thư giãn',
	'Đam mê với ẩm thực',
	'Đam mê với lịch sử, văn hóa',
	'Yêu thiên nhiên',
	'Giá rẻ là trên hết',
	'Có nhu cầu vui chơi, giải trí cao'
];
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
