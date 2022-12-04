// material
import {Alert, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import axios from 'axios';
import {Form, FormikProvider, useFormik} from 'formik';
import {useSnackbar} from 'notistack5';
import PropTypes from 'prop-types';
import {useCallback} from 'react';
import {API_URL} from 'shared/constants';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import axiosInstance from 'utils/axios';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

ResetNewPasswordForm.propTypes = {
	onSent: PropTypes.func,
	onGetEmail: PropTypes.func,
	sendResetToken: PropTypes.string
};

export default function ResetNewPasswordForm({onSent, onGetEmail, sendResetToken}) {
	const {resetPassword} = useAuth();
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();

	const ResetPasswordSchema = Yup.object().shape({
		password: Yup.string().min(6, 'Mật khẩu yêu cầu 6 ký tự trở lên').required('Yêu cầu nhập mật khẩu mới'),
		confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu nhập lại không khớp')
	});

	const formik = useFormik({
		initialValues: {
			password: '',
			confirmPassword: ''
		},
		validationSchema: ResetPasswordSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				await sendNewPassword(values, sendResetToken);
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

	const {errors, touched, isSubmitting, handleSubmit, getFieldProps} = formik;
	const sendNewPassword = useCallback(async (password, resetToken) => {
		try {
			await axiosInstance.patch(`${API_URL.User}/reset_password/${resetToken}`, password).then((res) => {
				console.log(res);
				enqueueSnackbar('Đặt lại mật khẩu thành công', {variant: 'success'});
			});
		} catch (e) {
			console.log(e.response.data.message);
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					{errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

					<TextField
						{...getFieldProps('password')}
						fullWidth
						autoComplete="on"
						type="password"
						label="Mật khẩu mới"
						error={Boolean(touched.password && errors.password)}
						helperText={(touched.password && errors.password) || 'Mật khẩu tối thiểu 6 ký tự'}
					/>

					<TextField
						{...getFieldProps('confirmPassword')}
						fullWidth
						autoComplete="on"
						type="password"
						label="Xác nhận lại mật khẩu"
						error={Boolean(touched.confirmPassword && errors.confirmPassword)}
						helperText={touched.confirmPassword && errors.confirmPassword}
					/>

					<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
						Reset Mật khẩu
					</LoadingButton>
				</Stack>
			</Form>
		</FormikProvider>
	);
}
