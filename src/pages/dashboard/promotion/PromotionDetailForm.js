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
import axios from 'axios';
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
			.min(2, 'Tên không hợp lệ!')
			.max(50, 'Tên không hợp lệ!')
			.required('Yêu cầu nhập tên'),
		destinationID: Yup.string().nullable(true).required('Yêu cầu địa điểm'),
		description: Yup.string().nullable(true).required('Yêu cầu mô tả địa điểm').max(500, 'Không quá 500 ký tự!'),
		value: Yup.number()
			.integer('Giá mã khuyến mãi phải là số nguyên')
			.min(1, 'Giá mã khuyến mãi phải là số dương')
			.max(99999, 'Giá mã khuyến mãi không quá hàng chục triệu')
			.required('Yêu cầu giá mã khuyến mãi'),
		salePrice: Yup.number()
			.integer('Giá bán phải là số nguyên')
			.min(1, 'Giá bán phải là số dương')
			.max(99999, 'Giá bán không quá hàng chục triệu')
			.required('Yêu cầu giá bán'),
		quantity: Yup.number()
			.integer('Số lượng phải là số nguyên')
			.min(1, 'Số lượng phải là số dương')
			.max(1000, 'Số lượng không quá hàng chục triệu')
			.required('Yêu cầu số lượng'),
		fromDate: Yup.string().nullable(true).required('Yêu cầu thời gian bắt đầu'),
		toDate: Yup.string().nullable(true).required('Yêu cầu thời gian kết thúc')
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
					enqueueSnackbar('Vui lòng chọn hình ảnh', {variant: 'error'});
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
			await axios.patch(`${API_URL.Voucher}/${data.id}`, data).then((res) => {
				enqueueSnackbar(res.data.message, {variant: 'success'});
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
				await axios.get(`${API_URL.Voucher}/${promotionID}`).then((res) => {
					if (res.status === 200) {
						console.log(res.data.data);
						const supArray = Object.assign(res.data.data.voucher, {
							destinationID: res.data.data.voucher.destinationApply.id
						});
						setData(supArray);
						setBusy(false);
						setGallery(!res.data.data.voucher.image ? [] : [res.data.data.voucher.image]);
					}
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
				await axios.get(`${API_URL.Voucher}/destinations`).then((res) => {
					setDestinationList(res.data.data);
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
					console.log(`upload ${images.image_file.name} thành công`);
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
							<h1 className="page-title text-center font-weight-bold">Thông tin mã khuyến mãi</h1>
							<Grid container sx={{height: '600px'}}>
								<Grid item xs={6}>
									<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
										<TextField
											fullWidth
											label="Tên khuyến mãi*"
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
													label="Địa điểm áp dụng"
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
											label="Thông tin khuyến mãi*"
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
											label="Số lượng mở bán*"
											{...getFieldProps('quantity')}
											error={Boolean(touched.quantity && errors.quantity)}
											helperText={touched.quantity && errors.quantity}
										/>
										<TextField
											fullWidth
											multiline
											label="Giá mã khuyến mãi*"
											{...getFieldProps('value')}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vnđ</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.value && errors.value)}
											helperText={touched.value && errors.value}
										/>
										<TextField
											fullWidth
											multiline
											label="Gía bán*"
											{...getFieldProps('salePrice')}
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<span className="adorment-text">x 1000 vnđ</span>
													</InputAdornment>
												)
											}}
											error={Boolean(touched.salePrice && errors.salePrice)}
											helperText={touched.salePrice && errors.salePrice}
										/>

										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<Stack direction={{xs: 'row'}} spacing={2}>
												<MobileDatePicker
													label="Ngày bắt đầu khuyến mãi*"
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
													label="Ngày kết thúc khuyến mãi*"
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
										Ngưng khuyến mãi
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
