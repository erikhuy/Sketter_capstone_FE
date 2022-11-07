import {useCallback, useEffect, useState} from 'react';
import {Form, FormikProvider, useFormik} from 'formik';
import {useSnackbar} from 'notistack5';
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import * as Yup from 'yup';
import {Box, Card, FormHelperText, Grid, Stack, TextField, Typography} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {fData} from 'utils/formatNumber';
import {useDispatchAction, useLoading} from 'shared/hooks';
import {updateMeThunk} from 'shared/redux/thunks/auth';
import {isNull} from 'lodash';
import {cleanUpUIStateAction} from 'shared/redux/slices/auth';
import AvatarUploadArea from 'components/avatararea/AvatarDropzone';
import {storage} from 'utils/firebase';
import {getDownloadURL, ref, uploadString} from 'firebase/storage';

export default function AccountGeneral() {
	const updateMe = useDispatchAction(updateMeThunk);
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const {user, updateMeErrorMessage} = useAuth();
	const cleanUpUIState = useDispatchAction(cleanUpUIStateAction);
	const isUpdatingMe = useLoading([updateMeThunk]);
	const [gallery, setGallery] = useState([]);

	const UpdateUserSchema = Yup.object().shape({
		name: Yup.string().min(2, 'Tên không hợp lệ!').max(50, 'Tên không hợp lệ!').required('Yêu cầu nhập tên'),
		phone: Yup.string()
			.nullable(true)
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(8, 'Số điện thoại không tồn tại!')
			.max(13, 'Số điện thoại không tồn tại!'),
		address: Yup.string()
			.min(2, 'Địa chỉ không hợp lệ!')
			.max(50, 'Địa chỉ không hợp lệ!')
			.required('Yêu cầu nhập địa chỉ')
	});

	useEffect(
		() => () => {
			cleanUpUIState();
		},
		[]
	);
	useEffect(() => {
		if (user.avatar) {
			setGallery([{url: user.avatar}]);
		} else {
			setGallery([]);
		}
	}, []);

	useEffect(() => {
		if (isNull(updateMeErrorMessage)) {
			return;
		}

		const message = updateMeErrorMessage || 'Cập nhật thành công';
		enqueueSnackbar(message, {variant: updateMeErrorMessage ? 'error' : 'success'});
	}, [updateMeErrorMessage]);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: Object.entries(user).reduce(
			(result, [key, value]) => ({
				...result,
				[key]: value || ''
			}),
			{}
		),
		validationSchema: UpdateUserSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			console.log(values);
			try {
				if (values.avatar !== null) {
					updateMe(values);
				} else {
					enqueueSnackbar('Vui lòng chọn hình ảnh', {variant: 'error'});
				}
				if (isMountedRef.current) {
					setSubmitting(false);
				}
			} catch (error) {
				if (isMountedRef.current) {
					setErrors({afterSubmit: error.code});
					setSubmitting(false);
				}
			}
		}
	});
	const handleImages = (data) => {
		setGallery(data);
		console.log(data);
		// eslint-disable-next-line array-callback-return
		if (data.length !== 0) {
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
						console.log(`upload ${images.image_file.name} thành công`);
					});
				} catch (e) {
					console.log(e);
				}
			});
		} else {
			setFieldValue('avatar', null);
			enqueueSnackbar('Vui lòng chọn hình ảnh', {variant: 'error'});
		}
	};
	const {values, errors, touched, handleSubmit, getFieldProps, setFieldValue} = formik;

	const handleDrop = useCallback(
		(acceptedFiles) => {
			const file = acceptedFiles[0];
			if (file) {
				setFieldValue('avatar', URL.createObjectURL(file));
			}
		},
		[setFieldValue]
	);

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={4}>
						<Card sx={{py: 1, px: 1, textAlign: 'center'}}>
							<AvatarUploadArea setImageList={handleImages} imageList={gallery} />
						</Card>
					</Grid>

					<Grid item xs={12} md={8}>
						<Card sx={{p: 3}}>
							<Stack spacing={{xs: 2, md: 3}}>
								<Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
									<TextField fullWidth label="Họ & Tên*" {...getFieldProps('name')} />
									<TextField fullWidth disabled label="Email" {...getFieldProps('email')} />
								</Stack>

								<Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
									<TextField fullWidth label="Số điện thoại*" {...getFieldProps('phone')} />
									<TextField fullWidth label="Địa chỉ*" {...getFieldProps('address')} />
								</Stack>
							</Stack>
							<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
								<LoadingButton type="submit" variant="contained" loading={isUpdatingMe}>
									Lưu
								</LoadingButton>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Form>
		</FormikProvider>
	);
}
