/* eslint-disable prettier/prettier */
/* eslint-disable array-callback-return */
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
import {DesktopDatePicker, LoadingButton, LocalizationProvider, MobileTimePicker, TimePicker} from '@material-ui/lab';
import {useLoading} from 'shared/hooks';
import {updateMeThunk} from 'shared/redux/thunks/auth';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlacesAutocomplete from 'components/placeautocomplete/PlacesAutocomplete';
import {CheckBoxIcon, CheckBoxOutlineBlankIcon} from '@material-ui/icons/CheckBox';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import ImageDropzone from 'components/imagearea/ImageDropzone';
import PropTypes from 'prop-types';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import Mapfield from 'components/mapfield';
import {API_URL} from 'shared/constants';
import {useSnackbar} from 'notistack5';
import {isNull} from 'lodash';
import {useNavigate} from 'react-router-dom';
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadBytes, uploadString} from 'firebase/storage';
import axiosInstance from 'utils/axios';

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
	const [cities, setCities] = useState([]);
	const [timeFrames, setTimeFrames] = useState([]);
	const [catalogs, setCatalogs] = useState([]);
	const [personalities, setPersonalities] = useState([]);

	const CreateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'T??n kh??ng h???p l???!').max(50, 'T??n kh??ng h???p l???!').required('Y??u c???u nh???p t??n'),
		// address: Yup.string().min(5, '?????a ch??? kh??ng h???p l???').required('Y??u c???u nh???p ?????a ch???'),
		phone: Yup.string()
			.nullable(true)
			.matches(/(\+84|0)((2[0-9])|(3)|(5)|(7)|(8)|(9))+([0-9]{8})\b/g, 'S??? ??i???n tho???i kh??ng h???p l???')
			.min(8, 'S??? ??i???n tho???i kh??ng t???n t???i!')
			.max(13, 'S??? ??i???n tho???i kh??ng t???n t???i!'),
		email: Yup.string().nullable(true).max(50, 'T??n kh??ng h???p l???!').email('Email kh??ng h???p l???'),
		lowestPrice: Yup.number()
			.integer('Gi?? l?? s??? nguy??n')
			.min(0, 'Gi?? ph???i l?? s??? nguy??n d????ng')
			.max(99999, 'Gi?? kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? th???p nh???t'),
		highestPrice: Yup.number()
			.integer('Gi?? l?? s??? nguy??n')
			.min(0, 'Gi?? ph???i l?? s??? nguy??n d????ng')
			.max(99999, 'Gi?? kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? cao nh???t'),
		catalogs: Yup.array().min(1, 'Y??u c???u lo???i ?????a ??i???m'),

		description: Yup.string().nullable(true).required('Y??u c???u m?? t??? ?????a ??i???m').max(500, 'Kh??ng qu?? 500 k?? t???!'),
		destinationPersonalities: Yup.array().min(1, 'Y??u c???u t??nh c??ch du l???ch'),
		openingTime: Yup.string().nullable(true, 'Th???i gian kh??ng ???????c tr???ng').required('Y??u c???u th???i gian m??? c???a'),
		closingTime: Yup.string()
			.nullable(true, 'Th???i gian kh??ng ???????c tr???ng')
			.required('Y??u c???u th???i gian ????ng c???a')
			.notOneOf([Yup.ref('openingTime')], 'Th???i gian m??? c???a kh??ng h???p l???'),

		estimatedTimeStay: Yup.number()
			.test('len', 'Th???i gian kh??ng h???p l???!', (val) => {
				if (val) return val.toString().length < 5;
			})
			.integer('Th???i gian ph???i l?? s??? nguy??n')

			.min(0, 'Th???i gian kh??ng h???p l???!')
			.max(240, 'Th???i gian kh??ng qu?? 4 ti???ng!')
			.required('Y??u c???u th???i gian d??? ki???n ??? l???i'),
		recommendedTimes: Yup.array().nullable(true).min(1, 'Kho???ng th???i gian l?? t?????ng kh??ng ???????c tr???ng')
	});
	const formik = useFormik({
		initialValues: {
			name: '',
			address: '',
			longitude: '',
			latitude: '',
			location: null,
			phone: null,
			email: null,
			description: '',
			supplierID: null,
			lowestPrice: 0,
			highestPrice: 0,
			openingTimeSup: null,
			openingTime: null,
			closingTimeSup: null,
			closingTime: null,
			estimatedTimeStay: '',
			recommendedTimes: [],
			destinationPersonalities: [],
			catalogs: [],
			gallery: []
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
				}
			}
		}
	});
	const processData = (data) => {
		if (!data.location) {
			enqueueSnackbar('Vui l??ng nh???p ?????a ??i???m', {variant: 'error'});
		}
		const supArray = data;
		supArray.longitude = data.location.lng;
		supArray.latitude = data.location.lat;
		supArray.address = data.location.destinationAddress;

		return supArray;
	};
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axiosInstance.get(`${API_URL.User}/supplier`).then((res) => {
					console.log(res.data.suppliers);
					setSuppliers(res.data.suppliers);
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchData();
	}, []);
	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axiosInstance.get(`${API_URL.City}`).then((res) => {
					console.log(res.data.cities);
					setCities(res.data.cities);
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
				await axiosInstance.get(`${API_URL.TimeFrames}`).then((res) => {
					setTimeFrames(res.data.timeFrames);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchSupplier();
	}, []);
	useEffect(() => {
		const supList = [];
		const fetchSupplier = async () => {
			try {
				await axiosInstance.get(`${API_URL.Cata}`).then((res) => {
					console.log(res.data.catalogs);
					res.data.catalogs.map((value) => {
						value.sub.map((item) => {
							// console.log(item.name);
							supList.push(item.name);
							setCatalogs(supList);
						});
					});
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
				await axiosInstance.get(`${API_URL.PT}`).then((res) => {
					console.log(res.data.personalities);
					setPersonalities(res.data.personalities);
				});
			} catch (error) {
				console.log(error);
				enqueueSnackbar(error.response.data.message, {variant: 'error'});
			}
		};
		fetchSupplier();
	}, []);

	const navigate = useNavigate();

	const navigateToViewDestination = () => {
		navigate('/dashboard/destinationList');
	};
	const createDestination = useCallback(async (data) => {
		console.log(data);
		try {
			await axiosInstance.post(`${API_URL.Destination}`, data).then((res) => {
				enqueueSnackbar('T???o ?????a ??i???m th??nh c??ng', {variant: 'success'});
				console.log(res);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
			// console.log(e.response.data.message);
		}
	});

	// const handleImages = (data) => {
	// 	setGallery(data);
	// 	const imageArray = [];
	// 	// eslint-disable-next-line array-callback-return
	// 	data.map((images) => {
	// 		try {
	// 			imgbbUploader({
	// 				apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
	// 				base64string: images.image_base64.split('base64,')[1]
	// 				// OPTIONAL: pass base64-encoded image (max 32Mb)
	// 			})
	// 				.then((response) => imageArray.push({url: response.url}))
	// 				.catch((error) => setCreateDestinationMessage(error));
	// 		} catch (e) {
	// 			console.log(e);
	// 		}
	// 	});
	// 	setFieldValue('gallery', imageArray);
	// };
	const handleImages = (data) => {
		setGallery(data);
		const imageArray = [];
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			console.log(images);
			try {
				const imageRef = ref(storage, `images/destination/${images.image_file.name}`);
				uploadString(imageRef, images.image_base64, 'data_url').then((e) => {
					getDownloadURL(ref(storage, `images/destination/${images.image_file.name}`)).then((e) => {
						console.log(e.split('&token')[0]);
						imageArray.push({url: e.split('&token')[0]});
					});
					console.log(`upload ${images.image_file.name} th??nh c??ng`);
				});
			} catch (e) {
				console.log(e);
			}
		});
		setFieldValue('gallery', imageArray);
	};
	const handleOpeningTime = (data) => {
		if (data !== null) {
			setFieldValue('openingTimeSup', data);
			setFieldValue('openingTime', data.toString().substr(16, 5));
		}
	};
	const handleClosingTime = (data) => {
		if (data !== null) {
			setFieldValue('closingTimeSup', data);
			setFieldValue('closingTime', data.toString().substr(16, 5));
		}
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
						<h1 className="page-title text-center font-weight-bold">Trang nh???p li???u</h1>
						<Grid container>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
								<h3>Th??ng tin ?????a ??i???m</h3>
									<TextField
										fullWidth
										label="T??n ?????a ??i???m*"
										{...getFieldProps('name')}
										error={Boolean(touched.name && errors.name)}
										helperText={touched.name && errors.name}
									/>
									<TextField
										fullWidth
										label="S??? ??i???n tho???i"
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
										onChange={(e, value) => {
											console.log(value.id);
											setFieldValue('cityID', value.id);
										}}
										id="tags-outlined"
										options={cities}
										getOptionLabel={(option) => option.name}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField {...params} label="Khu v???c" {...getFieldProps('cityID')} />
										)}
									/>
									<TextField
										fullWidth
										multiline
										label="Th??ng tin ?????a ??i???m*"
										rows={22}
										{...getFieldProps('description')}
										onChange={(value) => {
											setFieldValue(
												'description',
												value.target.value !== '' ? value.target.value : null
											);
										}}
										error={Boolean(touched.description && errors.description)}
										helperText={touched.description && errors.description}
									/>
									<Autocomplete
										onChange={(e, value) => {
											setFieldValue('supplierID', value !== null ? value.id : null);
										}}
										id="tags-outlined"
										options={suppliers}
										getOptionLabel={(option) => `${option.email}-${option.name}`}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												label="?????i t??c"
												{...getFieldProps('supplierID')}
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
											label={<span className="labelText">Gi?? th???p nh???t*</span>}
											InputLabelProps={{
												shrink: true,
												placeholder: '1000-10000'
											}}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vn??</span>
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
											label={<span className="labelText">Gi?? cao nh???t*</span>}
											InputLabelProps={{
												shrink: true,
												className: 'labelText2',
												placeholder: '1000-10000'
											}}
											InputProps={{
												className: 'text-field-style',

												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vn??</span>
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
										label="?????a ch???*"
										{...getFieldProps('address')}
										error={Boolean(touched.address && errors.address)}
										helperText={touched.address && errors.address}
									/>
									<TextField
										fullWidth
										type="number"
										label="Kinh ?????*"
										{...getFieldProps('longitude')}
										error={Boolean(touched.longitude && errors.longitude)}
										helperText={touched.longitude && errors.longitude}
									/>
									<TextField
										fullWidth
										label="V?? ?????*"
										type="number"
										{...getFieldProps('latitude')}
										error={Boolean(touched.latitude && errors.latitude)}
										helperText={touched.latitude && errors.latitude}
									/> */}
									<Mapfield name="location" label="?????a ch???*" placeholder="Ch???n ?????a ??i???m" />
									<Box
										sx={{
											height: 15
										}}
									/>
									<h3>Th??ng tin v??? ph??n lo???i</h3>
									<Autocomplete
										onChange={(e, value) => {
											setFieldValue('catalogs', value !== null ? value : initialValues.catalogs);
										}}
										multiple
										id="tags-outlined"
										options={catalogs}
										getOptionLabel={(option) => option}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												{...getFieldProps('catalogs')}
												label="Lo???i ?????a ??i???m"
												required
												error={Boolean(touched.catalogs && errors.catalogs)}
												helperText={touched.catalogs && errors.catalogs}
											/>
										)}
									/>
									<Autocomplete
										multiple
										id="tags-outlined"
										options={personalities}
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
												label="Lo???i t??nh c??ch"
												error={Boolean(
													touched.destinationPersonalities && errors.destinationPersonalities
												)}
												helperText={
													touched.destinationPersonalities && errors.destinationPersonalities
												}
											/>
										)}
									/>
									<h3>Th??ng tin v??? th???i gian</h3>
									<Stack direction={{xs: 'column'}} spacing={5} sx={{m: 2}}>
										<Stack direction={{xs: 'row'}} spacing={2}>
											<LocalizationProvider dateAdapter={AdapterDateFns}>
												<MobileTimePicker
													ampm={false}
													views={['hours', 'minutes']}
													label={<span className="labelText">Th???i gian m??? c???a*</span>}
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
												<MobileTimePicker
													ampm={false}
													label={<span className="labelText">Th???i gian ????ng c???a*</span>}
													value={values.closingTimeSup}
													minTime={values.openingTimeSup}
													onChange={(value) => handleClosingTime(value)}
													// acceptRegex="[0-2][0-9]:[0-6][0-9]"
													// disableMaskedInput
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
											label={<span className="labelText">Th???i gian tham quan</span>}
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
													label="Kho???ng th???i gian l?? t?????ng"
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
						<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								T???o ?????a ??i???m
							</LoadingButton>
						</Box>
					</Card>
				</Form>
			</FormikProvider>
		</>
	);
}

// const catalog = [
// 	{name: 'Qu??n ??n'},
// 	{name: 'Qu??n c?? ph??'},
// 	{name: '?????a ??i???m du l???ch'},
// 	{name: 'Homestay'},
// 	{name: 'Kh??ch s???n'},
// 	{name: 'Khu ngh??? d?????ng cao c???p'}
// ];
// const catalog = [
// 	'Qu??n ??n',
// 	'Qu??n n?????c',
// 	'?????a ??i???m du l???ch',
// 	'?????a ??i???m ng???m c???nh',
// 	'N??ng tr???i',
// 	'V?????n hoa',
// 	'C???m tr???i',
// 	'Homestay',
// 	'Kh??ch s???n',
// 	'Khu ngh??? d?????ng cao c???p',
// 	'B???n x???',
// 	'L???ch s???',
// 	'T??nh ng?????ng'
// ];
// const TravelPersonalityTypes = [
// 	'Th??ch kh??m ph??',
// 	'??a m???o hi???m',
// 	'T??m ki???m s??? th?? gi??n',
// 	'??am m?? v???i ???m th???c',
// 	'??am m?? v???i l???ch s???, v??n h??a',
// 	'Y??u thi??n nhi??n',
// 	'Gi?? r??? l?? tr??n h???t',
// 	'C?? nhu c???u vui ch??i, gi???i tr?? cao'
// ];
// const TravelPersonalityTypes = [
// 	{name: 'Th??ch kh??m ph??'},
// 	{name: '??a m???o hi???m'},
// 	{name: 'T??m ki???m s??? th?? gi??n'},
// 	{name: '??am m?? v???i ???m th???c'},
// 	{name: '??am m?? v???i l???ch s???, v??n h??a'},
// 	{name: 'Y??u thi??n nhi??n'},
// 	{name: 'Gi?? r??? l?? tr??n h???t'},
// 	{name: 'C?? nhu c???u vui ch??i, gi???i tr?? cao'}
// ];
const RecommendedTimesFrame = [
	{
		start: '00:00',
		end: '23:59'
	},
	{
		start: '00:00',
		end: '01:00'
	},
	{
		start: '01:00',
		end: '02:00'
	},
	{
		start: '02:00',
		end: '03:00'
	},
	{
		start: '03:00',
		end: '04:00'
	},
	{
		start: '04:00',
		end: '05:00'
	},
	{
		start: '05:00',
		end: '06:00'
	},
	{
		start: '06:00',
		end: '07:00'
	},
	{
		start: '07:00',
		end: '08:00'
	},
	{
		start: '08:00',
		end: '09:00'
	},
	{
		start: '09:00',
		end: '10:00'
	},
	{
		start: '10:00',
		end: '11:00'
	},
	{
		start: '11:00',
		end: '12:00'
	},
	{
		start: '12:00',
		end: '13:00'
	},
	{
		start: '13:00',
		end: '14:00'
	},
	{
		start: '14:00',
		end: '15:00'
	},
	{
		start: '15:00',
		end: '16:00'
	},
	{
		start: '16:00',
		end: '17:00'
	},
	{
		start: '17:00',
		end: '18:00'
	},
	{
		start: '18:00',
		end: '19:00'
	},
	{
		start: '19:00',
		end: '20:00'
	},
	{
		start: '20:00',
		end: '21:00'
	},
	{
		start: '21:00',
		end: '22:00'
	},
	{
		start: '22:00',
		end: '23:00'
	},
	{
		start: '23:00',
		end: '24:00'
	}
];
