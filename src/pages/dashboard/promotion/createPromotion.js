/* eslint-disable prettier/prettier */
// material
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
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Modal
} from '@material-ui/core';
import axios from 'axios';
import AvatarUploadArea from 'components/avatararea/AvatarDropzone';
import Paypal from 'components/Paypal';
import {Form, FormikProvider, useFormik} from 'formik';
import {useSnackbar} from 'notistack5';
import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {API_URL} from 'shared/constants';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadString} from 'firebase/storage';
import {Dayjs} from 'dayjs';
import * as Yup from 'yup';
import {DatePicker, DateRangePicker, LoadingButton, LocalizationProvider, MobileDatePicker} from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
//

// ----------------------------------------------------------------------

export default function CreateUserForm() {
	const [gallery, setGallery] = useState([]);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const navigate = useNavigate();
	const [destinationList, setDestinationList] = useState([]);

	// eslint-disable-next-line no-bitwise
	const [value, setValue] = useState();

	const CreatePromotionSchema = Yup.object().shape({
		name: Yup.string()
			.nullable(true)
			.min(2, 'Tên không hợp lệ!')
			.max(50, 'Tên không hợp lệ!')
			.required('Yêu cầu nhập tên'),
		destinationID: Yup.string().nullable(true).required('Yêu cầu địa điểm'),
		description: Yup.string().nullable(true).required('Yêu cầu mô tả địa điểm').max(500, 'Không quá 500 ký tự!'),
		value: Yup.number()
			.integer('Giá trị phải là số nguyên')
			.min(1, 'Giá trị phải là số dương')
			.max(99999, 'Giá trị không quá hàng chục triệu')
			.required('Yêu cầu giá trị'),
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
		initialValues: {
			destinationID: null,
			name: null,
			image: null,
			description: null,
			quantity: 0,
			value: 0,
			salePrice: 0,
			fromDate: null,
			toDate: null
		},
		validationSchema: CreatePromotionSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				if (values.image !== null) {
					await createPromotion(values);
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
				}
			}
		}
	});
	const createPromotion = useCallback(async (data) => {
		console.log(data);
		try {
			await axios.post(`${API_URL.Voucher}`, data).then((res) => {
				enqueueSnackbar('Tạo khuyến mãi	 thành công', {variant: 'success'});
				console.log(res.data);
			});
		} catch (e) {
			console.log(e.response.data.message);
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
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
	const {errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, values} = formik;

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<div
					style={{
						position: 'absolute',
						left: '55%',
						top: '54%',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<Card sx={{p: 3}}>
						<h1 className="page-title text-center font-weight-bold">Tạo khuyến mãi</h1>
						<Grid container sx={{width: 1200}}>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={3.6} sx={{m: 2}}>
									<Autocomplete
										onChange={(e, value) => {
											setFieldValue('destinationID', value !== null ? value.id : null);
										}}
										id="tags-outlined"
										options={destinationList}
										getOptionLabel={(option) => option.name}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												multiline="false"
												style={{height: 56, width: 460}}
												required
												{...params}
												label="Địa điểm áp dụng"
												{...getFieldProps('destinationID')}
												error={Boolean(touched.destinationID && errors.destinationID)}
												helperText={touched.destinationID && errors.destinationID}
											/>
										)}
									/>
									<TextField
										style={{height: 56, width: 460}}
										fullWidth
										type="text"
										label="Tên khuyến mãi*"
										{...getFieldProps('name')}
										error={Boolean(touched.name && errors.name)}
										helperText={touched.name && errors.name}
									/>
									<TextField
										style={{width: 460}}
										rows={12}
										multiline
										fullWidth
										type="text"
										label="Mô tả thông tin khuyến mãi*"
										{...getFieldProps('description')}
										error={Boolean(touched.description && errors.description)}
										helperText={touched.description && errors.description}
									/>
									<TextField
										style={{height: 56, width: 460}}
										fullWidth
										type="number"
										label="Gía trị khuyến mãi*"
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
								</Stack>
							</Grid>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={4} sx={{m: 2}}>
									<TextField
										style={{height: 56, width: 460}}
										fullWidth
										type="number"
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
									<TextField
										style={{height: 56, width: 460}}
										fullWidth
										type="number"
										label="Số lượng*"
										{...getFieldProps('quantity')}
										error={Boolean(touched.quantity && errors.quantity)}
										helperText={touched.quantity && errors.quantity}
									/>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<Stack direction={{xs: 'row'}} spacing={2}>
											<MobileDatePicker
												disablePast
												label="Ngày bắt đầu khuyến mãi*"
												maxDate={values.toDate}
												value={values.fromDate}
												onChange={(e, value) => {
													console.log(e.toDateString());
													setFieldValue('fromDate', e.toDateString());
												}}
												renderInput={(params) => (
													<TextField
														style={{height: 56, width: 224}}
														{...params}
														error={Boolean(touched.fromDate && errors.fromDate)}
														helperText={touched.fromDate && errors.fromDate}
													/>
												)}
											/>
											<MobileDatePicker
												disablePast
												minDate={values.fromDate}
												label="Ngày kết thúc khuyến mãi*"
												value={values.toDate}
												onChange={(e, value) => {
													console.log(e.toDateString());
													setFieldValue('toDate', e.toDateString());
												}}
												renderInput={(params) => (
													<TextField
														style={{height: 56, width: 224}}
														{...params}
														error={Boolean(touched.toDate && errors.toDate)}
														helperText={touched.toDate && errors.toDate}
													/>
												)}
											/>
										</Stack>
										<AvatarUploadArea setImageList={handleImages} imageList={gallery} />
									</LocalizationProvider>
								</Stack>
							</Grid>
						</Grid>
						<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								Check out
							</LoadingButton>
						</Box>
					</Card>
				</div>
			</Form>
		</FormikProvider>
	);
}

//  <div>{checkOut ? <Paypal /> : <Button onClick={() => setCheckOut(true)}>Check out</Button>}</div>;
