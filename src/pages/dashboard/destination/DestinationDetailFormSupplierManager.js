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
import axiosInstance from 'utils/axios';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
DestinationDetailFormSupplierManager.propTypes = {
	destinationID: PropTypes.object.isRequired
};
export default function DestinationDetailFormSupplierManager({destinationID, onReload, onOpenModal}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const [valueArray, setValueArray] = useState([]);
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [suppliers, setSuppliers] = useState([]);
	const [cities, setCities] = useState([]);
	const [timeFrames, setTimeFrames] = useState([]);
	const [catalogs, setCatalogs] = useState([]);
	const [personalities, setPersonalities] = useState([]);

	const UpdateDestinationSchema = Yup.object().shape({
		name: Yup.string().min(2, 'T??n kh??ng h???p l???!').max(50, 'T??n kh??ng h???p l???!').required('Y??u c???u nh???p t??n'),
		phone: Yup.string()
			.nullable(true)
			.matches(/^[0-9]+$/, 'Y??u c???u nh???p s??? ??i???n tho???i')
			.min(8, 'S??? ??i???n tho???i kh??ng t???n t???i!')
			.max(13, 'S??? ??i???n tho???i kh??ng t???n t???i!'),
		email: Yup.string().nullable(true).max(50, 'T??n kh??ng h???p l???!').email('Email kh??ng h???p l???'),
		lowestPrice: Yup.number()
			.integer('Gi?? ph???i l?? s??? nguy??n')
			.min(0, 'Gi?? ph???i l?? s??? nguy??n d????ng')
			.max(99999, 'Gi?? kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? th???p nh???t'),
		highestPrice: Yup.number()
			.integer('Gi?? ph???i l?? s??? nguy??n')
			.min(0, 'Gi?? ph???i l?? s??? nguy??n d????ng')
			.max(99999, 'Gi?? kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? cao nh???t'),
		description: Yup.string().nullable(true).required('Y??u c???u m?? t??? ?????a ??i???m').max(500, 'Kh??ng qu?? 500 k?? t???!'),

		catalogs: Yup.array().min(1, 'Y??u c???u lo???i ?????a ??i???m'),
		destinationPersonalities: Yup.array().min(1, 'Y??u c???u t??nh c??ch du l???ch'),
		estimatedTimeStay: Yup.number()
			.integer('Th???i gian ph???i l?? s??? nguy??n')
			.min(0, 'Th???i gian kh??ng h???p l???!')
			.max(240, 'Th???i gian kh??ng qu?? 4 ti???ng!')
			.required('Y??u c???u th???i gian d??? ki???n ??? l???i'),
		openingTime: Yup.string().nullable(true, 'Th???i gian kh??ng ???????c tr???ng').required('Y??u c???u th???i gian m??? c???a'),
		closingTime: Yup.string()
			.nullable(true, 'Th???i gian kh??ng ???????c tr???ng')
			.required('Y??u c???u th???i gian ????ng c???a')
			.notOneOf([Yup.ref('openingTime')], 'Th???i gian m??? c???a kh??ng h???p l???'),
		recommendedTimes: Yup.array().nullable(true).min(1, 'Kho???ng th???i gian l?? t?????ng kh??ng ???????c tr???ng')
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
			await axiosInstance.patch(`${API_URL.Destination}/${data.id}`, data).then((res) => {
				enqueueSnackbar(res.message, {variant: 'success'});
				onReload(data);
				onOpenModal(false);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});

	const handleAction = useCallback(async (id, action) => {
		console.log(data);
		const dataSup = processData(data);
		dataSup.status = action;
		if (action === 'Deactivated') {
			try {
				await axiosInstance.patch(`${API_URL.Destination}/${dataSup.id}/deactivate`).then((res) => {
					enqueueSnackbar(res.message, {variant: 'success'});
					onReload(data);
					onOpenModal(false);
					console.log(res);
				});
			} catch (e) {
				enqueueSnackbar(e.response.data.message, {variant: 'error'});
			}
		} else {
			try {
				await axiosInstance.patch(`${API_URL.Destination}/${dataSup.id}`, dataSup).then((res) => {
					enqueueSnackbar(res.message, {variant: 'success'});
					onReload(data);
					onOpenModal(false);
					console.log(res);
				});
			} catch (e) {
				enqueueSnackbar(e.response.data.message, {variant: 'error'});
			}
		}
	});
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
			}
		};
		fetchSupplier();
	}, []);
	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axiosInstance.get(`${API_URL.User}/supplier`).then((res) => {
					console.log(res.data.suppliers);
					setSuppliers(res.data.suppliers);
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
		const fetchData = async () => {
			try {
				await axiosInstance.get(`${API_URL.Destination}/${destinationID}`).then((res) => {
					console.log(res.data);
					const supArray = Object.assign(res.data.destination, locationData);
					supArray.location.lng = res.data.destination.longitude;
					supArray.location.lat = res.data.destination.latitude;
					supArray.location.destinationAddress = res.data.destination.address;
					setData(supArray);
					setBusy(false);
					setGallery(res.data.destination.gallery);
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
						console.log(`upload ${images.image_file.name} th??nh c??ng`);
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
		if (data !== null) {
			console.log(data);
			return data?.toString().substr(16, 5);
		}
	};
	const handleStringToTime = (data) => {
		if (data !== null) {
			const hms = data;
			return new Date(`1970-01-01 ${hms}`);
		}
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
							<h1 className="page-title text-center font-weight-bold">Th??ng tin ?????a ??i???m</h1>
							<Grid container>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
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
										<Autocomplete
											disabled
											id="tags-outlined"
											options={cities}
											value={values.city}
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
											error={Boolean(touched.description && errors.description)}
											helperText={touched.description && errors.description}
										/>
										<Autocomplete
											disabled
											id="tags-outlined"
											options={suppliers}
											value={values.supplier}
											getOptionLabel={(option) => `${option.email}-${option.name}`}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													{...params}
													label="?????i t??c"
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
												label={<span className="labelText">Gi?? th???p nh???t*</span>}
												InputLabelProps={{
													shrink: true,
													placeholder: '1000-10000'
												}}
												InputProps={{
													endAdornment: (
														<InputAdornment position="end">
															<span className="adorment-text">vn??</span>
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
															<span className="adorment-text">vn??</span>
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
										{/* <TextField fullWidth label="?????a ch???" {...getFieldProps('address')} />
										<TextField fullWidth label="Kinh ?????" {...getFieldProps('latitude')} />
										<TextField fullWidth label="V?? ?????" {...getFieldProps('longitude')} /> */}
										<Mapfield name="location" label="?????a ch???" placeholder="Ch???n ?????a ??i???m" />

										<Box
											sx={{
												height: 15
											}}
										/>
										<h2>Th??ng tin v??? ph??n lo???i</h2>
										<h3 className="category-label">Lo???i ?????a ??i???m</h3>
										<Autocomplete
											multiple
											id="tags-outlined"
											options={catalogs}
											value={convertCatalogToArray(values.catalogs)}
											getOptionLabel={(option) => option}
											filterSelectedOptions
											onChange={(event, value) => {
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
													label="Lo???i ?????a ??i???m*"
													error={Boolean(touched.catalogs && errors.catalogs)}
													helperText={touched.catalogs && errors.catalogs}
												/>
											)}
										/>
										<h3 className="category-label">T??nh c??ch du l???ch ng?????i d??ng</h3>
										<Autocomplete
											disabled
											multiple
											id="tags-outlined"
											options={personalities}
											getOptionLabel={(option) => option}
											filterSelectedOptions
											value={convertDestinationPersonalityToArray(
												values.destinationPersonalities
											)}
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
													label="Lo???i t??nh c??ch*"
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
										<h3>Th??ng tin v??? th???i gian</h3>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<MobileTimePicker
												ampm={false}
												views={['hours', 'minutes']}
												label={<span className="labelText">Th???i gian m??? c???a*</span>}
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
												label={<span className="labelText">Th???i gian ????ng c???a*</span>}
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
											label={<span className="labelText">Th???i gian d??? ki???n ??? l???i</span>}
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
													label="Kho???ng th???i gian l?? t?????ng"
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
											color="error"
											variant="contained"
											onClick={(e, value) => {
												handleAction(values.id, 'Deactivated');
											}}
										>
											Ng??ng v??nh vi???n
										</Button>
										<Button
											color="success"
											variant="contained"
											onClick={(e, value) => {
												handleAction(values.id, 'Closed');
											}}
										>
											????ng c???a
										</Button>

										<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
											C???p nh???t
										</LoadingButton>
									</Stack>
								) : values.status === 'Closed' ? (
									<Stack direction={{xs: 'row'}} spacing={2}>
										<Button
											color="error"
											variant="contained"
											onClick={(e, value) => {
												handleAction(values.id, 'Deactivated');
											}}
										>
											Ng??ng v??nh vi???n
										</Button>
										<Button
											color="success"
											variant="contained"
											onClick={(e, value) => {
												handleAction(values.id, 'Open');
											}}
										>
											M??? ho???t ?????ng
										</Button>
									</Stack>
								) : null}
							</Box>
							{/* <Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
								<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
									C???p nh???t
								</LoadingButton>
							</Box> */}
						</Card>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}

// const catalogs = [
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
// const destinationPersonalities = [
// 	{
// 		personalityName: 'Th??ch kh??m ph??',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: '??a m???o hi???m',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'T??m ki???m s??? th?? gi??n',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: '??am m?? v???i ???m th???c',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: '??am m?? v???i l???ch s???, v??n h??a',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Y??u thi??n nhi??n',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'Gi?? r??? l?? tr??n h???t',
// 		planCount: 0,
// 		visitCount: 0
// 	},
// 	{
// 		personalityName: 'C?? nhu c???u vui ch??i, gi???i tr?? cao',
// 		planCount: 0,
// 		visitCount: 0
// 	}
// 	// 'Th??ch kh??m ph??',
// 	// '??a m???o hi???m',
// 	// 'T??m ki???m s??? th?? gi??n',
// 	// '??am m?? v???i ???m th???c',
// 	// '??am m?? v???i l???ch s???, v??n h??a',
// 	// 'Y??u thi??n nhi??n',
// 	// 'Gi?? r??? l?? tr??n h???t',
// 	// 'C?? nhu c???u vui ch??i, gi???i tr?? cao'
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
