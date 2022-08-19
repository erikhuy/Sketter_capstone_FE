// material
import {Alert, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import axios from 'axios';
import {Form, FormikProvider, useFormik} from 'formik';
import PropTypes from 'prop-types';
import {useCallback} from 'react';
import {API_URL} from 'shared/constants';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
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

	const ResetPasswordSchema = Yup.object().shape({
		password: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
		confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
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
			await axios.patch(`${API_URL.User}/reset_password/${resetToken}`, password);
		} catch (e) {
			console.log('');
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
						label="New Password"
						error={Boolean(touched.password && errors.password)}
						helperText={(touched.password && errors.password) || 'Password must be minimum 6+'}
					/>

					<TextField
						{...getFieldProps('confirmPassword')}
						fullWidth
						autoComplete="on"
						type="password"
						label="Confirm New Password"
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
