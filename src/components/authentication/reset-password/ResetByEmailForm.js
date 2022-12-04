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
import axiosInstance from 'utils/axios';
import * as Yup from 'yup';

// ----------------------------------------------------------------------

ResetNewPasswordForm.propTypes = {
	onSent: PropTypes.func,
	onGetEmail: PropTypes.func
};

export default function ResetNewPasswordForm({onSent, onGetEmail}) {
	const {resetPassword} = useAuth();
	const isMountedRef = useIsMountedRef();

	const ResetPasswordSchema = Yup.object().shape({
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu email')
	});

	const formik = useFormik({
		initialValues: {
			email: ''
		},
		validationSchema: ResetPasswordSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				await sendEmailForgotPassword(values);
				if (isMountedRef.current) {
					onSent();
					onGetEmail(formik.values.email);
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
	const sendEmailForgotPassword = useCallback(async (email) => {
		try {
			await axiosInstance.post(`${API_URL.User}/forgot_password`, email);
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
						fullWidth
						{...getFieldProps('email')}
						type="email"
						label="Địa chỉ Email*"
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>

					<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
						Reset Mật khẩu
					</LoadingButton>
				</Stack>
			</Form>
		</FormikProvider>
	);
}
