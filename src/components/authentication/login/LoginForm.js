import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {Icon} from '@iconify/react';
import {Alert, Checkbox, FormControlLabel, IconButton, InputAdornment, Link, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {Form, FormikProvider, useFormik} from 'formik';
import {isEmpty} from 'lodash';
import {useSnackbar} from 'notistack5';
import {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import {PATH_AUTH} from 'shared/routes/paths';
import * as Yup from 'yup';
import {MIconButton} from '../../@material-extend';

export default function LoginForm() {
	const {login, errorMessage} = useAuth();
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar, closeSnackbar} = useSnackbar();
	const [showPassword, setShowPassword] = useState(false);

	const LoginSchema = Yup.object().shape({
		email: Yup.string().email('Email must be a valid email address').required('Email is required'),
		password: Yup.string().required('Password is required')
	});

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			remember: true
		},
		validationSchema: LoginSchema,
		onSubmit: async ({email, password}) => {
			login({email, password});
		}
	});

	const {errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setErrors, setSubmitting} = formik;

	useEffect(() => {
		if (errorMessage === null) {
			return;
		}
		if (isMountedRef.current && !isEmpty(errorMessage)) {
			setSubmitting(false);
			setErrors({afterSubmit: errorMessage});
		} else {
			enqueueSnackbar('Login success', {
				variant: 'success',
				action: (key) => (
					<MIconButton size="small" onClick={() => closeSnackbar(key)}>
						<Icon icon={closeFill} />
					</MIconButton>
				)
			});
		}
	}, [errorMessage]);

	const handleShowPassword = () => {
		setShowPassword((show) => !show);
	};

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Stack spacing={3}>
					{errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

					<TextField
						fullWidth
						autoComplete="username"
						type="email"
						label="Email address"
						{...getFieldProps('email')}
						error={Boolean(touched.email && errors.email)}
						helperText={touched.email && errors.email}
					/>

					<TextField
						fullWidth
						autoComplete="current-password"
						type={showPassword ? 'text' : 'password'}
						label="Password"
						{...getFieldProps('password')}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton onClick={handleShowPassword} edge="end">
										<Icon icon={showPassword ? eyeFill : eyeOffFill} />
									</IconButton>
								</InputAdornment>
							)
						}}
						error={Boolean(touched.password && errors.password)}
						helperText={touched.password && errors.password}
					/>
				</Stack>

				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{my: 2}}>
					<FormControlLabel
						control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
						label="Remember me"
					/>

					<Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
						Forgot password?
					</Link>
				</Stack>

				<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
					Login
				</LoadingButton>
			</Form>
		</FormikProvider>
	);
}
