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
	Button,
	FormControl,
	InputLabel,
	MenuItem
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
import Select from 'theme/overrides/Select';
import AvatarUploadArea from 'components/avatararea/AvatarDropzone';
import {useNavigate} from 'react-router';
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadString} from 'firebase/storage';
import LoadingScreen from 'components/LoadingScreen';
import axiosInstance from 'utils/axios';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
UserDetailForm.propTypes = {
	userID: PropTypes.object.isRequired
};
export default function UserDetailForm({userID, onReload, onOpenModal}) {
	// eslint-disable-next-line no-bitwise
	const isMountedRef = useIsMountedRef();
	const [gallery, setGallery] = useState([]);
	const [valueArray, setValueArray] = useState([]);
	const {enqueueSnackbar} = useSnackbar();
	const [data, setData] = useState();
	const [isBusy, setBusy] = useState(true);
	const [createDestinationMessage, setCreateDestinationMessage] = useState();
	const navigate = useNavigate();

	const UpdateUserSchema = Yup.object().shape({
		name: Yup.string().min(2, 'T??n kh??ng h???p l???!').max(50, 'T??n kh??ng h???p l???!').required('Y??u c???u nh???p t??n'),
		address: Yup.string()
			.min(5, '?????a ch??? kh??ng h???p l???')
			.nullable(true, 'Y??u c???u nh???p ?????a ch???')
			.required('Y??u c???u nh???p ?????a ch???'),
		email: Yup.string().email('Email kh??ng h???p l???').required('Y??u c???u nh???p email'),
		status: Yup.string().nullable(true, 'Tr???ng th??i kh??ng ???????c tr???ng').required('Y??u c???u tr???ng th??i')
	});

	const formik = useFormik({
		enableReinitialize: true,
		validationSchema: UpdateUserSchema,
		initialValues: data,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			console.log(values);
			try {
				await updateUser(values);
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
	// const handleImages = (data) => {
	// 	console.log(data);
	// 	setGallery(data);
	// 	if (data.length === 0) {
	// 		setFieldValue('avatar', null);
	// 	}
	// 	// eslint-disable-next-line array-callback-return
	// 	data.map((images) => {
	// 		if (!images.url) {
	// 			try {
	// 				imgbbUploader({
	// 					apiKey: '80129f4ae650eb206ddfe55e3184196c', // MANDATORY
	// 					base64string: images.image_base64.split('base64,')[1]
	// 					// OPTIONAL: pass base64-encoded image (max 32Mb)
	// 				})
	// 					// eslint-disable-next-line no-const-assign
	// 					.then((response) => setFieldValue('avatar', response.url))
	// 					.catch((error) => console.log(error));
	// 			} catch (e) {
	// 				console.log(e);
	// 			}
	// 		} else {
	// 			setFieldValue('avatar', response.url);
	// 		}
	// 	});
	// };
	const handleImages = (data) => {
		setGallery(data);
		// eslint-disable-next-line array-callback-return
		data.map((images) => {
			console.log(images);
			try {
				const imageRef = ref(storage, `images/destination/${images.image_file.name}`);
				uploadString(imageRef, images.image_base64, 'data_url').then((e) => {
					getDownloadURL(ref(storage, `images/destination/${images.image_file.name}`)).then((e) => {
						console.log(e.split('&token')[0]);
						setFieldValue('avatar', e.split('&token')[0]);
					});
					console.log(`upload ${images.image_file.name} th??nh c??ng`);
				});
			} catch (e) {
				console.log(e);
			}
		});
	};
	const updateUser = useCallback(async (data) => {
		try {
			await axiosInstance
				.patch(`${API_URL.User}/${data.id}`, data)
				.then((res) => {
					enqueueSnackbar('C???p nh???t th??ng tin th??nh c??ng', {variant: 'success'});
					onReload(data);
					onOpenModal(false);
				})
				.catch((e) => enqueueSnackbar(e.response.data.message, {variant: 'error'}));
		} catch (e) {
			console.log(e.response.data.message);
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
	const convertToArray = (data) => data;
	useEffect(() => {
		const fetchData = async () => {
			try {
				await axiosInstance.get(`${API_URL.User}/${userID}`).then((res) => {
					console.log(res.data);
					setData(res.data);
					// !res.data.avatar ? setGallery([]) : setGallery([res.data.avatar]);
					setGallery(!res.data.avatar ? [] : [{url: res.data.avatar}]);
					setBusy(false);
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

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
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								transform: 'translate(-50%, -50%)'
							}}
						>
							<h1
								className="page-title text-center font-weight-bold"
								style={{
									textAlign: 'center'
								}}
							>
								Th??ng tin t??i kho???n
							</h1>
							<Stack direction={{xs: 'column'}} spacing={3.6} sx={{m: 2}}>
								<AvatarUploadArea setImageList={handleImages} imageList={gallery} />
								<TextField
									style={{height: 56, width: 460}}
									disabled
									fullWidth
									type="email"
									label="Email*"
									{...getFieldProps('email')}
									error={Boolean(touched.email && errors.email)}
									helperText={touched.email && errors.email}
								/>
								<TextField
									required
									style={{height: 56, width: 460}}
									fullWidth
									type="text"
									label="?????a ch???*"
									{...getFieldProps('address')}
									error={Boolean(touched.address && errors.address)}
									helperText={touched.address && errors.address}
								/>
								{values.role.name === 'Traveler' ? (
									<>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DesktopDatePicker
												label="Ng??y sinh"
												value={new Date(values.dob)}
												// inputFormat="dd/mm/yyyy"
												onChange={(e, value) => {
													console.log(e.toDateString());
													setFieldValue('dob', e.toDateString());
												}}
												renderInput={(params) => <TextField required {...params} />}
											/>
										</LocalizationProvider>
										<Autocomplete
											id="tags-outlined"
											options={gender}
											value={values.gender}
											getOptionLabel={(option) => option}
											onChange={(e, value) => {
												setFieldValue('gender', value);
											}}
											filterSelectedOptions
											renderInput={(params) => (
												<TextField
													multiline="false"
													required
													{...params}
													{...getFieldProps('gender')}
													label="Gi???i t??nh"
													error={Boolean(touched.gender && errors.gender)}
													helperText={touched.gender && errors.gender}
												/>
											)}
										/>
									</>
								) : null}

								<TextField
									style={{height: 56, width: 460}}
									fullWidth
									type="text"
									label="T??n*"
									{...getFieldProps('name')}
									error={Boolean(touched.name && errors.name)}
									helperText={touched.name && errors.name}
								/>
								<Autocomplete
									disableClearable
									id="tags-outlined"
									// eslint-disable-next-line eqeqeq
									options={
										values.status === 'Unverified'
											? userStatus
											: values.status === ''
											? userStatusNone
											: userStatusSup
									}
									value={convertToArray(values.status)}
									getOptionLabel={(option) => option}
									filterSelectedOptions
									onChange={(event, value) => {
										console.log(value);
										setFieldValue('status', value);
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
											{...getFieldProps('status')}
											label="Tr???ng th??i*"
											error={Boolean(touched.status && errors.status)}
											helperText={touched.status && errors.status}
										/>
									)}
								/>
							</Stack>
							<Box sx={{mt: 3, display: 'flex', justifyContent: 'center'}}>
								<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
									C???p nh???t
								</LoadingButton>
							</Box>
						</div>
					)}
				</Form>
			</FormikProvider>
		</>
	);
}

// const catalogs = ['Qu??n ??n', 'Qu??n c?? ph??', '?????a ??i???m du l???ch', 'Homestay', 'Kh??ch s???n', 'Khu ngh??? d?????ng cao c???p'];
const userStatus = ['Verified', 'Unverified'];
const userStatusSup = ['Verified', 'Deactivated'];
const userStatusNone = ['Verified', 'Unverified', 'Deactivated'];
const gender = ['Nam', 'N???'];
