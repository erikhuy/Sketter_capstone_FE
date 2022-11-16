/* eslint-disable prettier/prettier */
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
	Chip,
	Button
} from '@material-ui/core';
import {useFormik, Form, FormikProvider} from 'formik';
import {DesktopDatePicker, LoadingButton, LocalizationProvider, MobileTimePicker, TimePicker} from '@material-ui/lab';
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
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadBytes, uploadString} from 'firebase/storage';
import LoadingScreen from 'components/LoadingScreen';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
DestinationDetailForm.propTypes = {
	destinationID: PropTypes.object.isRequired
};
export default function DestinationDetailForm({destinationID, onReload, onOpenModal}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [cities, setCities] = useState([]);
	const [timeFrames, setTimeFrames] = useState([]);
	const [catalogs, setCatalogs] = useState([]);
	const [personalities, setPersonalities] = useState([]);

	const UpdateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Tên không hợp lệ!').max(50, 'Tên không hợp lệ!').required('Yêu cầu nhập tên'),
		phone: Yup.string()
			.nullable(true)
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(8, 'Số điện thoại không tồn tại!')
			.max(13, 'Số điện thoại không tồn tại!'),
		email: Yup.string().nullable(true).max(50, 'Tên không hợp lệ!').email('Email không hợp lệ'),
		lowestPrice: Yup.number()
			.integer('Giá phải là số nguyên')
			.min(0, 'Giá phải là số nguyên dương')
			.max(99999, 'Giá không quá hàng chục triệu')
			.required('Yêu cầu giá thấp nhất'),
		highestPrice: Yup.number()
			.integer('Giá phải là số nguyên')
			.min(0, 'Giá phải là số nguyên dương')
			.max(99999, 'Giá không quá hàng chục triệu')
			.required('Yêu cầu giá cao nhất'),
		description: Yup.string().nullable(true).required('Yêu cầu mô tả địa điểm').max(500, 'Không quá 500 ký tự!'),

		catalogs: Yup.array().min(1, 'Yêu cầu loại địa điểm'),
		destinationPersonalities: Yup.array().min(1, 'Yêu cầu tính cách du lịch'),

		estimatedTimeStay: Yup.number()
			.test('len', 'Thời gian không hợp lệ!', (val) => {
				if (val) return val.toString().length < 5;
			})
			.integer('Thời gian phải là số nguyên')

			.min(0, 'Thời gian không hợp lệ!')
			.max(240, 'Thời gian không quá 4 tiếng!')
			.required('Yêu cầu thời gian dự kiến ở lại'),
		openingTime: Yup.string().nullable(true, 'Thời gian không được trống').required('Yêu cầu thời gian mở cửa'),
		closingTime: Yup.string()
			.nullable(true, 'Thời gian không được trống')
			.required('Yêu cầu thời gian đóng cửa')
			.notOneOf([Yup.ref('openingTime')], 'Thời gian mở cửa không hợp lệ'),
		recommendedTimes: Yup.array().nullable(true).min(1, 'Khoảng thời gian lý tưởng không được trống')
	});
	const locationData = {
		location: {
			destinationAddress: null,
			lng: null,
			lat: null
		}
	};
	const processData = (data) => {
		console.log(data.location);
		const supLocation = data.location;
		const supArray = Object.assign(data, locationData);
		supArray.catalogs = convertCatalogToArray(data?.catalogs);
		supArray.destinationPersonalities = convertDestinationPersonalityToArray(data?.destinationPersonalities);
		supArray.location.lng = supLocation.lng;
		supArray.location.lat = supLocation.lat;
		supArray.location.destinationAddress = supLocation.destinationAddress;
		supArray.longitude = supLocation.lng;
		supArray.latitude = supLocation.lat;
		supArray.address = supLocation.destinationAddress;
		return supArray;
	};
	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdateDestinationSchema,
		initialValues: data,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			console.log(values.location);
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
				enqueueSnackbar(res.data.message, {variant: 'success'});
				onReload(data);
				onOpenModal(false);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axios.get(`${API_URL.City}`).then((res) => {
					console.log(res.data.data.cities);
					setCities(res.data.data.cities);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchSupplier();
	}, []);
	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axios.get(`${API_URL.TimeFrames}`).then((res) => {
					setTimeFrames(res.data.data.timeFrames);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchSupplier();
	}, []);
	const handleAction = useCallback(async (id, action) => {
		console.log(data);
		const dataSup = processData(data);
		dataSup.status = action;
		try {
			await axios.patch(`${API_URL.Destination}/${dataSup.id}`, dataSup).then((res) => {
				enqueueSnackbar(res.data.message, {variant: 'success'});
				onReload(data);
				onOpenModal(false);
				console.log(res.data);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
	useEffect(() => {
		const supList = [];
		const fetchSupplier = async () => {
			try {
				await axios.get(`${API_URL.Cata}`).then((res) => {
					if (res.status === 200) {
						console.log(res.data.data.catalogs);
						res.data.data.catalogs.map((value) => {
							value.sub.map((item) => {
								// console.log(item.name);
								supList.push(item.name);
								setCatalogs(supList);
							});
						});
					}
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchSupplier();
	}, []);
	useEffect(() => {
		const supList = [];
		const fetchSupplier = async () => {
			try {
				await axios.get(`${API_URL.PT}`).then((res) => {
					if (res.status === 200) {
						console.log(res.data.data.personalities);
						setPersonalities(res.data.data.personalities);
					}
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchSupplier();
	}, []);

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
						setGallery(res.data.data.destination.gallery);
					}
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

	// const handleImages = (data) => {
	// 	setGallery(data);
	// 	const imageArray = [];
	// 	// eslint-disable-next-line array-callback-return
	// 	data.map((images) => {
	// 		if (!images.url) {
	// 			try {
	// 				imgbbUploader({
	// 					apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
	// 					base64string: images.image_base64.split('base64,')[1]
	// 					// OPTIONAL: pass base64-encoded image (max 32Mb)
	// 				})
	// 					.then((response) => imageArray.push({url: response.url}))
	// 					.catch((error) => setCreateDestinationMessage(error));
	// 			} catch (e) {
	// 				console.log(e);
	// 			}
	// 		} else {
	// 			imageArray.push({url: images.url});
	// 		}
	// 	});
	// 	setFieldValue('gallery', imageArray);
	// };

	const handleImages = (data) => {
		setGallery(data);
		const imageArray = [];
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			if (!images.url) {
				try {
					const imageRef = ref(storage, `images/destination/${images.image_file.name}`);
					uploadString(imageRef, images.image_base64, 'data_url').then((e) => {
						getDownloadURL(ref(storage, `images/destination/${images.image_file.name}`)).then((e) => {
							console.log(e.split('&token')[0]);
							imageArray.push({url: e.split('&token')[0]});
						});
						console.log(`upload ${images.image_file.name} thành công`);
					});
				} catch (e) {
					console.log(e);
				}
			} else {
				imageArray.push({url: images.url});
			}
		});
		setFieldValue('gallery', imageArray);
	};
	const convertDestinationPersonalityToArray = (data) => {
		const supData = [];
		// eslint-disable-next-line array-callback-return
		data?.map((x) => {
			if (typeof x === 'object') {
				supData.push(x.name);
			} else {
				supData.push(x);
			}
		});
		return supData;
	};
	const convertCatalogToArray = (data) => {
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
						<>
							<Box
								sx={{
									height: 400
								}}
							/>
							<LoadingScreen />
						</>
					) : (
						<Card sx={{p: 3}}>
							<h1 className="page-title text-center font-weight-bold">Trang nhập liệu</h1>
							<Grid container>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
										<TextField
											fullWidth
											label="Tên địa điểm*"
											{...getFieldProps('name')}
											error={Boolean(touched.name && errors.name)}
											helperText={touched.name && errors.name}
										/>
										<TextField
											fullWidth
											label="Số điện thoại"
											{...getFieldProps('phone')}
											onChange={(value) => {
												setFieldValue(
													'phone',
													value.target.value !== '' ? value.target.value : null
												);
											}}
											error={Boolean(touched.phone && errors.phone)}
											helperText={touched.phone && errors.phone}
										/>
										<TextField
											fullWidth
											label="Email"
											{...getFieldProps('email')}
											onChange={(value) => {
												setFieldValue(
													'email',
													value.target.value !== '' ? value.target.value : null
												);
											}}
											error={Boolean(touched.email && errors.email)}
											helperText={touched.email && errors.email}
										/>
										<Autocomplete
											disabled
											onChange={(e, value) => {
												console.log(value.id);
												setFieldValue('cityID', value.id);
											}}
											id="tags-outlined"
											options={cities}
											value={values.city}
											getOptionLabel={(option) => option.name}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField {...params} label="Khu vực" {...getFieldProps('cityID')} />
											)}
										/>
										<TextField
											fullWidth
											multiline
											label="Thông tin địa điểm*"
											rows={22}
											{...getFieldProps('description')}
											error={Boolean(touched.description && errors.description)}
											helperText={touched.description && errors.description}
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
											value={convertCatalogToArray(values.catalogs)}
											getOptionLabel={(option) => option}
											filterSelectedOptions
											onChange={(e, value) => {
												setFieldValue('catalogs', value !== null ? value : []);
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
													label="Loại địa điểm*"
													error={Boolean(touched.catalogs && errors.catalogs)}
													helperText={touched.catalogs && errors.catalogs}
												/>
											)}
										/>
										<h3 className="category-label">Tính cách du lịch người dùng</h3>
										<Autocomplete
											disabled
											multiple
											id="tags-outlined"
											options={personalities}
											value={convertDestinationPersonalityToArray(
												values.destinationPersonalities
											)}
											getOptionLabel={(option) => console.log(option)}
											filterSelectedOptions
											renderTags={(tagValue, getTagProps) =>
												tagValue.map((option, index) => (
													<Chip label={option} {...getTagProps({index})} />
												))
											}
											renderInput={(params) => (
												<TextField
													multiline="false"
													{...params}
													label="Loại tính cách*"
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
											<MobileTimePicker
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
											<MobileTimePicker
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
											options={timeFrames}
											value={values.recommendedTimes}
											getOptionLabel={(option) => `${option.from}-${option.to}`}
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
								{values.status === 'Open' ? (
									<Stack direction={{xs: 'row'}} spacing={2}>
										<Button
											color="success"
											variant="contained"
											onClick={(e, value) => {
												handleAction(values.id, 'Closed');
											}}
										>
											Đóng cửa
										</Button>

										<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
											Cập nhật
										</LoadingButton>
									</Stack>
								) : values.status === 'Closed' ? (
									<Button
										color="success"
										variant="contained"
										onClick={(e, value) => {
											handleAction(values.id, 'Open');
										}}
									>
										Mở hoạt động
									</Button>
								) : null}
							</Box>
						</Card>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}

// const catalogs = [
// 	'Quán ăn',
// 	'Quán nước',
// 	'Địa điểm du lịch',
// 	'Địa điểm ngắm cảnh',
// 	'Nông trại',
// 	'Vườn hoa',
// 	'Cắm trại',
// 	'Homestay',
// 	'Khách sạn',
// 	'Khu nghỉ dưỡng cao cấp',
// 	'Bản xứ',
// 	'Lịch sử',
// 	'Tính ngưỡng'
// ];
// const destinationPersonalities = [
// 	{
// 		personalityName: 'Thích khám phá',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Ưa mạo hiểm',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Tìm kiếm sự thư giãn',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Đam mê với ẩm thực',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Đam mê với lịch sử, văn hóa',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Yêu thiên nhiên',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Giá rẻ là trên hết',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Có nhu cầu vui chơi, giải trí cao',
// 		planCount: 0,
// 		visitCount: 0
// 	}
// 	// 'Thích khám phá',
// 	// 'Ưa mạo hiểm',
// 	// 'Tìm kiếm sự thư giãn',
// 	// 'Đam mê với ẩm thực',
// 	// 'Đam mê với lịch sử, văn hóa',
// 	// 'Yêu thiên nhiên',
// 	// 'Giá rẻ là trên hết',
// 	// 'Có nhu cầu vui chơi, giải trí cao'
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
