/* eslint-disable prettier/prettier */
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
UpdateDestinationForm.propTypes = {
	destinationID: PropTypes.object.isRequired
};
export default function UpdateDestinationForm({destinationID}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const [valueArray, setValueArray] = useState([]);
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);

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
		estimatedTimeStay: Yup.number()
			.min(0, 'Thời gian không hợp lệ!')
			.max(1440, 'Thời gian không quá 1 ngày!')
			.required('Yêu cầu thời gian dự kiến ở lại')
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
		supArray.location.lng = data.longitude;
		supArray.location.lat = data.latitude;
		supArray.location.destinationAddress = data.address;
		supArray.catalogs = convertToArray(data?.catalogs);
		supArray.destinationPersonalities = convertToArray(data?.destinationPersonalities);
		// eslint-disable-next-line array-callback-return
		data.images.map((image) => {
			if (!image.url) {
				console.log('BASE64');
				try {
					imgbbUploader({
						apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
						base64string: image.image_base64.split('base64,')[1]
						// OPTIONAL: pass base64-encoded image (max 32Mb)
					})
						.then((response) => supArray.images.push({url: response.url}), console.log('SUCCESS'))
						.catch((error) => setCreateDestinationMessage(error));
				} catch (e) {
					setCreateDestinationMessage(e);
				}
			}
		});
		return supArray;
	};
	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdateDestinationSchema,
		initialValues: !data ? null : data,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
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
		// try {
		// 	await axios.patch(`${API_URL.Destination}/${data.id}`, data).then((res) => {
		// 		setCreateDestinationMessage(res.data.message);
		// 		console.log(res.data);
		// 		// navigateToViewDestination();
		// 	});
		// } catch (e) {
		// 	console.log(e.response.data.message);
		// 	setCreateDestinationMessage(e.response.data.message);
		// }
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axios.get(`${API_URL.Destination}/${destinationID}`).then((res) => {
					if (res.status === 200) {
						setData(res.data.data);
						setBusy(false);
						console.log(res.data.data);
					}
				});
			} catch (error) {
				console.log(error.response.data.message);
				setCreateDestinationMessage(error.response.data.message);
			}
		};
		fetchData();
	}, []);

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
		return data.toString().substr(16, 5);
	};
	const handleStringToTime = (data) => {
		const hms = data;
		return new Date(`1970-01-01 ${hms}`);
	};

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
					.catch((error) => console.error(error));
			} catch (e) {
				console.log(e);
			}
		});
		setFieldValue('images', imageArray);
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
											onChange={() => {
												console.log({...getFieldProps('location')});
											}}
										/>
										<TextField fullWidth label="Số điện thoại" {...getFieldProps('phone')} />
										<TextField fullWidth label="Email" {...getFieldProps('email')} />
										<TextField
											fullWidth
											multiline
											label="Thông tin địa điểm"
											rows={12}
											{...getFieldProps('description')}
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
											/>
										</Stack>
									</Stack>
								</Grid>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
										{/* <PlacesAutocomplete location={location} updateLocation={setLocation} /> */}
										<TextField fullWidth label="Địa chỉ" {...getFieldProps('address')} />
										<TextField fullWidth label="Kinh độ" {...getFieldProps('latitude')} />
										<TextField fullWidth label="Vĩ độ" {...getFieldProps('longitude')} />
										{/* <Mapfield name="location" label="Địa chỉ" placeholder="Chọn địa điểm" /> */}

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
												<TextField multiline="false" {...params} label="Loại địa điểm" />
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
												<TextField multiline="false" {...params} label="Loại tính cách" />
											)}
										/>
										<h3>Thông tin về thời gian</h3>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												ampm={false}
												views={['hours', 'minutes']}
												label={<span className="labelText">Thời gian mở cửa*</span>}
												maxTime={handleStringToTime(values.closingTime)}
												value={handleStringToTime(values.openingTime)}
												onChange={(value) =>
													setFieldValue('openingTime', handleTimeToString(value))
												}
												renderInput={(params) => <TextField {...params} />}
											/>
										</LocalizationProvider>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												ampm={false}
												label={<span className="labelText">Thời gian đóng cửa*</span>}
												minTime={handleStringToTime(values.openingTime)}
												value={handleStringToTime(values.closingTime)}
												onChange={(value) =>
													setFieldValue('closingTime', handleTimeToString(value))
												}
												renderInput={(params) => <TextField {...params} />}
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
													label="Khoảng thời gian lý tưởng"
												/>
											)}
										/>
										<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
											<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
												Cập nhật
											</LoadingButton>
										</Box>
									</Stack>
								</Grid>
								<ImageDropzone
									setImageList={(value) => {
										setFieldValue('images', value);
									}}
									imageList={values.images}
								/>
							</Grid>
						</Card>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}

const catalogs = ['Quán ăn', 'Quán cà phê', 'Địa điểm du lịch', 'Homestay', 'Khách sạn', 'Khu nghỉ dưỡng cao cấp'];

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
