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
	Stack,
	InputAdornment,
	TextField,
	Typography,
	Autocomplete,
	Checkbox,
	Chip,
	Button
} from '@material-ui/core';
import {useFormik, Form, FormikProvider} from 'formik';
import {
	DesktopDatePicker,
	LoadingButton,
	LocalizationProvider,
	MobileDatePicker,
	MobileTimePicker,
	TimePicker
} from '@material-ui/lab';
import {useLoading} from 'shared/hooks';
import {updateMeThunk} from 'shared/redux/thunks/auth';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlacesAutocomplete from 'components/placeautocomplete/PlacesAutocomplete';
import {CheckBoxIcon, CheckBoxOutlineBlankIcon} from '@material-ui/icons/CheckBox';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import ImageDropzone from 'components/imagearea/ImageDropzone';
import PropTypes from 'prop-types';
import Mapfield from 'components/mapfield';
import axiosInstance from 'utils/axios';
import {API_URL} from 'shared/constants';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import imgbbUploader from 'imgbb-uploader/lib/cjs';
import {useSnackbar} from 'notistack5';
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadBytes, uploadString} from 'firebase/storage';
import LoadingScreen from 'components/LoadingScreen';
import AvatarUploadArea from 'components/avatararea/AvatarDropzone';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
PromotionDetailForm.propTypes = {
	promotionID: PropTypes.object.isRequired
};
export default function PromotionDetailForm({promotionID, onReload, onOpenModal}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [destinationList, setDestinationList] = useState([]);

	const UpdatePromotionSchema = Yup.object().shape({
		name: Yup.string()
			.nullable(true)
			.min(2, 'T??n kh??ng h???p l???!')
			.max(50, 'T??n kh??ng h???p l???!')
			.required('Y??u c???u nh???p t??n'),
		destinationID: Yup.string().nullable(true).required('Y??u c???u ?????a ??i???m'),
		description: Yup.string().nullable(true).required('Y??u c???u m?? t??? ?????a ??i???m').max(500, 'Kh??ng qu?? 500 k?? t???!'),
		value: Yup.number()
			.integer('Gi?? m?? khuy???n m??i ph???i l?? s??? nguy??n')
			.min(1, 'Gi?? m?? khuy???n m??i ph???i l?? s??? d????ng')
			.max(99999, 'Gi?? m?? khuy???n m??i kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? m?? khuy???n m??i'),
		salePrice: Yup.number()
			.integer('Gi?? b??n ph???i l?? s??? nguy??n')
			.min(1, 'Gi?? b??n ph???i l?? s??? d????ng')
			.max(99999, 'Gi?? b??n kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u gi?? b??n'),
		quantity: Yup.number()
			.integer('S??? l?????ng ph???i l?? s??? nguy??n')
			.min(1, 'S??? l?????ng ph???i l?? s??? d????ng')
			.max(1000, 'S??? l?????ng kh??ng qu?? h??ng ch???c tri???u')
			.required('Y??u c???u s??? l?????ng'),
		fromDate: Yup.string().nullable(true).required('Y??u c???u th???i gian b???t ?????u'),
		toDate: Yup.string().nullable(true).required('Y??u c???u th???i gian k???t th??c')
	});

	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdatePromotionSchema,
		initialValues: data,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			console.log(values);
			try {
				if (values.image !== null) {
					await updatePromotion(values);
				} else {
					enqueueSnackbar('Vui l??ng ch???n h??nh ???nh', {variant: 'error'});
				}
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

	const updatePromotion = useCallback(async (data) => {
		console.log(data);
		try {
			await axiosInstance.patch(`${API_URL.Voucher}/${data.id}`, data).then((res) => {
				enqueueSnackbar(res.message, {variant: 'success'});
				onReload(data);
				onOpenModal(false);
			});
		} catch (e) {
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				await axiosInstance.get(`${API_URL.Voucher}/${promotionID}`).then((res) => {
					console.log(res.data);
					const supArray = Object.assign(res.data.voucher, {
						destinationID: res.data.voucher.destinationApply.id
					});
					setData(supArray);
					setBusy(false);
					setGallery(!res.data.voucher.image ? [] : [res.data.voucher.image]);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);
	useEffect(() => {
		const fetchSupplier = async () => {
			try {
				await axiosInstance.get(`${API_URL.Voucher}/destinations`).then((res) => {
					setDestinationList(res.data);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchSupplier();
	}, []);
	const handleImages = (data) => {
		if (data.length === 0) {
			setFieldValue('image', null);
		}
		setGallery(data);
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			console.log(images);
			try {
				const imageRef = ref(storage, `images/destination/${images.image_file.name}`);
				uploadString(imageRef, images.image_base64, 'data_url').then((e) => {
					getDownloadURL(ref(storage, `images/destination/${images.image_file.name}`)).then((e) => {
						console.log(e.split('&token')[0]);
						setFieldValue('image', e.split('&token')[0]);
					});
					console.log(`upload ${images.image_file.name} th??nh c??ng`);
				});
			} catch (e) {
				console.log(e);
			}
		});
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
									height: 350
								}}
							/>
							<LoadingScreen />
						</>
					) : (
						<Card sx={{p: 3}}>
							<h1 className="page-title text-center font-weight-bold">Th??ng tin m?? khuy???n m??i</h1>
							<Grid container sx={{height: '600px'}}>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
										<TextField
											fullWidth
											label="T??n khuy???n m??i*"
											{...getFieldProps('name')}
											error={Boolean(touched.name && errors.name)}
											helperText={touched.name && errors.name}
										/>
										<Autocomplete
											onChange={(e, value) => {
												setFieldValue('destinationID', value.id !== null ? value.id : null);
											}}
											id="tags-outlined"
											value={values.destinationApply}
											options={destinationList}
											getOptionLabel={(option) => option.name}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													style={{height: 56, width: 512}}
													{...params}
													label="?????a ??i???m ??p d???ng"
													{...getFieldProps('destinationID')}
													required
													error={Boolean(touched.destinationID && errors.destinationID)}
													helperText={touched.destinationID && errors.destinationID}
												/>
											)}
										/>
										<TextField
											fullWidth
											multiline
											label="Th??ng tin khuy???n m??i*"
											rows={16}
											{...getFieldProps('description')}
											error={Boolean(touched.description && errors.description)}
											helperText={touched.description && errors.description}
										/>
									</Stack>
								</Grid>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2.4} sx={{m: 2}}>
										<TextField
											fullWidth
											multiline
											label="S??? l?????ng m??? b??n*"
											{...getFieldProps('quantity')}
											error={Boolean(touched.quantity && errors.quantity)}
											helperText={touched.quantity && errors.quantity}
										/>
										<TextField
											fullWidth
											multiline
											label="Gi?? m?? khuy???n m??i*"
											{...getFieldProps('value')}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vn??</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.value && errors.value)}
											helperText={touched.value && errors.value}
										/>
										<TextField
											fullWidth
											multiline
											label="G??a b??n*"
											{...getFieldProps('salePrice')}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vn??</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.salePrice && errors.salePrice)}
											helperText={touched.salePrice && errors.salePrice}
										/>

										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<Stack direction={{xs: 'row'}} spacing={2}>
												<MobileDatePicker
													label="Ng??y b???t ?????u khuy???n m??i*"
													value={values.fromDate}
													onChange={(e, value) => {
														console.log(e.toDateString());
														setFieldValue('fromDate', e.toDateString());
													}}
													renderInput={(params) => (
														<TextField
															style={{height: 56, width: 256}}
															{...params}
															error={Boolean(touched.fromDate && errors.fromDate)}
															helperText={touched.fromDate && errors.fromDate}
														/>
													)}
												/>
												<MobileDatePicker
													label="Ng??y k???t th??c khuy???n m??i*"
													value={values.toDate}
													onChange={(e, value) => {
														console.log(e.toDateString());
														setFieldValue('toDate', e.toDateString());
													}}
													renderInput={(params) => (
														<TextField
															style={{height: 56, width: 256}}
															{...params}
															error={Boolean(touched.toDate && errors.toDate)}
															helperText={touched.toDate && errors.toDate}
														/>
													)}
												/>
											</Stack>
										</LocalizationProvider>

										<AvatarUploadArea setImageList={handleImages} imageList={gallery} />
									</Stack>
								</Grid>
							</Grid>

							<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
								<Stack direction={{xs: 'row'}} spacing={2}>
									<Button color="error" variant="contained">
										Ng??ng khuy???n m??i
									</Button>
									<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
										C???p nh???t
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
