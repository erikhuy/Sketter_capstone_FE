import * as Yup from 'yup';
import {useSnackbar} from 'notistack5';
import {useFormik, Form, FormikProvider} from 'formik';
// material
import {Stack, Card, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
// utils
import {useEffect} from 'react';
import {isNull} from 'lodash';
import useAuth from 'shared/hooks/useAuth';
import {cleanUpUIStateAction} from 'shared/redux/slices/auth';
import {updatePasswordThunk} from 'shared/redux/thunks/auth';
import {useDispatchAction, useLoading} from 'shared/hooks';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
	const updatePassword = useDispatchAction(updatePasswordThunk);
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const {updatePasswordErrorMessage} = useAuth();
	const isUpdatingMe = useLoading([updatePasswordThunk]);

	useEffect(
		() => () => {
			cleanUpUIStateAction();
		},
		[]
	);

	useEffect(() => {
		if (isNull(updatePasswordErrorMessage)) {
			return;
		}

		const message = updatePasswordErrorMessage || 'Cập nhật mật khẩu thành công';
		enqueueSnackbar(message, {variant: updatePasswordErrorMessage ? 'error' : 'success'});
	}, [updatePasswordErrorMessage]);

	const ChangePassWordSchema = Yup.object().shape({
		currentPassword: Yup.string().required('Yêu cầu nhập lại mật khẩu cũ'),
		newPassword: Yup.string().min(6, 'Mật khẩu yêu cầu 6 ký tự trở lên').required('Yêu cầu nhập mật khẩu'),
		confirmNewPassword: Yup.string()
			.oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
			.required('Yêu cầu nhập mật khẩu')
	});

	const formik = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: ''
		},
		validationSchema: ChangePassWordSchema,
		onSubmit: async (values, {setSubmitting}) => {
			try {
				updatePassword(values);
				if (isMountedRef.current) {
					setSubmitting(false);
				}
			} catch (error) {
				if (isMountedRef.current) {
					setSubmitting(false);
				}
			}
		}
	});

	const {errors, touched, isSubmitting, handleSubmit, getFieldProps} = formik;

	return (
		<Card sx={{p: 3}}>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Stack spacing={3} alignItems="flex-end">
						<TextField
							{...getFieldProps('currentPassword')}
							fullWidth
							autoComplete="on"
							type="password"
							label="Mật khẩu cũ*"
							error={Boolean(touched.currentPassword && errors.currentPassword)}
							helperText={touched.currentPassword && errors.currentPassword}
						/>

						<TextField
							{...getFieldProps('newPassword')}
							fullWidth
							autoComplete="on"
							type="password"
							label="Mật khẩu mới*"
							error={Boolean(touched.newPassword && errors.newPassword)}
							helperText={
								(touched.newPassword && errors.newPassword) || 'Mật khẩu phải gồm có 6 ký tự trở lên'
							}
						/>

						<TextField
							{...getFieldProps('confirmNewPassword')}
							fullWidth
							autoComplete="on"
							type="password"
							label="Nhập lại mật khẩu mới*"
							error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
							helperText={touched.confirmNewPassword && errors.confirmNewPassword}
						/>

						<LoadingButton type="submit" variant="contained" loading={isUpdatingMe}>
							Lưu
						</LoadingButton>
					</Stack>
				</Form>
			</FormikProvider>
		</Card>
	);
}
