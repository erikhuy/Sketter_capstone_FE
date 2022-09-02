import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {Icon} from '@iconify/react';
// material
import {Alert, IconButton, InputAdornment, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {Form, FormikProvider, useFormik} from 'formik';
import {isNull} from 'lodash';
import {useSnackbar} from 'notistack5';
import {useEffect, useState} from 'react';
import {useDispatchAction} from 'shared/hooks';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import {registerThunk} from 'shared/redux/thunks/auth';
import * as Yup from 'yup';
//
import {MIconButton} from '../../@material-extend';

// ----------------------------------------------------------------------

export default function RegisterForm() {
	const registerSupplier = useDispatchAction(registerThunk);
	const {registerErrorMessage} = useAuth();
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (isNull(registerErrorMessage)) {
			return;
		}

		const message = registerErrorMessage || 'Update success';
		enqueueSnackbar(message, {variant: registerErrorMessage ? 'error' : 'success'});
	}, [enqueueSnackbar, registerErrorMessage]);

	const RegisterSchema = Yup.object().shape({
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(7, 'Quá ngắn!')
			.max(13, 'Quá dài!')
			.required('Yêu cầu nhập số điện thoại'),
		address: Yup.string().min(5, 'Địa chỉ không hợp lệ').required('Yêu cầu nhập địa chỉ'),
		owner: Yup.string().min(2, 'Quá ngắn!').max(50, 'Quá dài!').required('Yêu cầu nhập họ'),
		name: Yup.string().min(2, 'Quá ngắn!').max(50, 'Quá dài!').required('Yêu cầu nhập tên'),
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
		password: Yup.string().min(6, 'Mật khẩu có ít nhất 6 ký tự').required('Yêu cầu mật khẩu'),
		confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
	});

	const formik = useFormik({
		initialValues: {
			phone: '',
			address: '',
			owner: '',
			name: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		validationSchema: RegisterSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				console.log(values);
				registerSupplier(values);
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

	const {errors, touched, handleSubmit, isSubmitting, getFieldProps} = formik;

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					{errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

					<TextField
						fullWidth
						type="email"
						label="Email"
						{...getFieldProps('email')}
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>

					<TextField
						fullWidth
						type={showPassword ? 'text' : 'password'}
						label="Mật khẩu"
						{...getFieldProps('password')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
										<Icon icon={showPassword ? eyeFill : eyeOffFill} />
									</IconButton>
								</InputAdornment>
							)
						}}
						error={Boolean(touched.password && errors.password)}
						helperText={touched.password && errors.password}
					/>
					<TextField
						fullWidth
						type={showConfirmPassword ? 'text' : 'password'}
						label="Nhập lại mật khẩu"
						{...getFieldProps('confirmPassword')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton edge="end" onClick={() => setShowConfirmPassword((prev) => !prev)}>
										<Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
									</IconButton>
								</InputAdornment>
							)
						}}
						error={Boolean(touched.confirmPassword && errors.confirmPassword)}
						helperText={touched.confirmPassword && errors.confirmPassword}
					/>
					<TextField
						fullWidth
						type="text"
						label="Tên"
						{...getFieldProps('name')}
						error={Boolean(touched.name && errors.name)}
						helperText={touched.name && errors.name}
					/>
					<TextField
						fullWidth
						type="text"
						label="Chủ sở hữu"
						{...getFieldProps('owner')}
						error={Boolean(touched.owner && errors.owner)}
						helperText={touched.owner && errors.owner}
					/>
					<TextField
						fullWidth
						type="text"
						label="Số điện thoại"
						{...getFieldProps('phone')}
						error={Boolean(touched.phone && errors.phone)}
						helperText={touched.phone && errors.phone}
					/>
					<TextField
						fullWidth
						type="text"
						label="Địa chỉ"
						{...getFieldProps('address')}
						error={Boolean(touched.address && errors.address)}
						helperText={touched.address && errors.address}
					/>
					<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
						Đăng Ký
					</LoadingButton>
				</Stack>
			</Form>
		</FormikProvider>
	);
}
