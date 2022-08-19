/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */

import * as Yup from 'yup';
import React, {useState} from 'react';
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
export default function CreateDestination() {
	// eslint-disable-next-line no-bitwise
	const [registerDate, setRegisterDate] = useState(new Date());
	const isUpdatingMe = useLoading([updateMeThunk]);
	const [location, setLocation] = useState({
		address: '',
		coordinates: [0, 0]
	});
	const [gallery, setGallery] = useState([]);
	const ChangePassWordSchema = Yup.object().shape({
		currentPassword: Yup.string().required('Old Password is required')
	});
	const formik = useFormik({
		validationSchema: ChangePassWordSchema,
		onSubmit: async (values, {setSubmitting}) => {
			console.log(values);
		}
	});

	const {errors, touched, isSubmitting, handleSubmit, getFieldProps} = formik;

	return (
		<>
			<h1 className="page-title text-center font-weight-bold">Trang nhập liệu</h1>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Card sx={{p: 3}}>
						<Grid container>
							<Grid item xs={6}>
								<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
									<TextField fullWidth label="Tên địa điểm" {...getFieldProps('name')} />
									<TextField fullWidth label="Số điện thoại" {...getFieldProps('phone')} />
									<TextField fullWidth label="Email" {...getFieldProps('email')} />
									<TextField fullWidth label="Chủ sở hữu" {...getFieldProps('owner')} />
									<TextField
										fullWidth
										multiline
										label="Mô tả tổng quát"
										rows={12}
										{...getFieldProps('description')}
									/>
									<TextField
										fullWidth
										multiline
										label="Mô tả tổng quát"
										rows={12}
										{...getFieldProps('suggestInformation')}
									/>
									<Stack direction={{xs: 'row'}} spacing={2}>
										<TextField
											{...getFieldProps('priceRangeFrom')}
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
											{...getFieldProps('priceRangeTo')}
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
								<Stack direction={{xs: 'column'}} spacing={2} sx={{m: 2}}>
									<PlacesAutocomplete location={location} updateLocation={setLocation} />
									<Box
										sx={{
											height: 15
										}}
									/>
									<h2>Thông tin về phân loại</h2>
									<h3 className="category-label">Catalog</h3>
									<Autocomplete
										multiple
										id="tags-outlined"
										options={catalog}
										getOptionLabel={(option) => option.catalogType}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												label="Loại địa điểm"
												style={{height: 56, width: 320}}
											/>
										)}
									/>
									<h3 className="category-label">Tính cách du lịch người dùng</h3>
									<Autocomplete
										multiple
										id="tags-outlined"
										options={travelPersonalityTypes}
										getOptionLabel={(option) => option.personalityTypes}
										filterSelectedOptions
										renderInput={(params) => (
											<TextField
												{...params}
												label="Loại tính cách"
												style={{height: 56, width: 320}}
											/>
										)}
									/>
									<h3>Thông tin về thời gian</h3>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<TimePicker
											ampm={false}
											label={<span className="labelText">Thời gian mở cửa</span>}
											renderInput={(params) => (
												<TextField
													{...params}
													required
													name="time_open"
													style={{height: 56, width: 320}}
													InputLabelProps={{
														shrink: true,
														className: 'labelText2'
													}}
												/>
											)}
										/>
									</LocalizationProvider>
									<LocalizationProvider dateAdapter={AdapterDateFns}>
										<TimePicker
											ampm={false}
											label={<span className="labelText">Thời gian đóng cửa</span>}
											renderInput={(params) => (
												<TextField
													required
													{...params}
													name="time_close"
													style={{height: 56, width: 320}}
													InputLabelProps={{
														shrink: true,
														className: 'labelText2'
													}}
												/>
											)}
										/>
									</LocalizationProvider>
									<TextField
										name="spendingTime"
										required
										className="form-control"
										style={{height: 56, width: 320}}
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
													name="authorized_day"
													style={{height: 56, width: 320}}
													InputLabelProps={{
														shrink: true,
														className: 'labelText2'
													}}
												/>
											)}
										/>
									</LocalizationProvider>
									<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
										<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
											Save Changes
										</LoadingButton>
									</Box>
								</Stack>
							</Grid>
							<ImageDropzone setImageList={setGallery} imageList={gallery} />
						</Grid>
					</Card>
				</Form>
			</FormikProvider>
		</>
	);
}

const catalog = [
	{catalogType: 'Quán ăn'},
	{catalogType: 'Quán cà phê'},
	{catalogType: 'Địa điểm du lịch'},
	{catalogType: 'Homestay'},
	{catalogType: 'Khách sạn'},
	{catalogType: 'Biệt thự'},
	{catalogType: 'Khu nghỉ dưỡng cao cấp'},
	{catalogType: 'Nhà xe'}
];

const travelPersonalityTypes = [
	{personalityTypes: 'Thích khám phá'},
	{personalityTypes: 'Ưa mạo hiểm'},
	{personalityTypes: 'Tìm kiếm sự thư giãn'},
	{personalityTypes: 'Đam mê với ẩm thực'},
	{personalityTypes: 'Đam mê với lịch sử, văn hóa'},
	{personalityTypes: 'Yêu thiên nhiên'},
	{personalityTypes: 'Giá rẻ là trên hết'},
	{personalityTypes: 'Có nhu cầu vui chơi, giải trí cao'}
];
