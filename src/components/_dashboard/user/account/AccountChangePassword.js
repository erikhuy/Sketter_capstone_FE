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

		const message = updatePasswordErrorMessage || 'Update success';
		enqueueSnackbar(message, {variant: updatePasswordErrorMessage ? 'error' : 'success'});
	}, [updatePasswordErrorMessage]);

	const ChangePassWordSchema = Yup.object().shape({
		currentPassword: Yup.string().required('Old Password is required'),
		newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
		confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
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
							label="Old Password"
							error={Boolean(touched.currentPassword && errors.currentPassword)}
							helperText={touched.currentPassword && errors.currentPassword}
						/>

						<TextField
							{...getFieldProps('newPassword')}
							fullWidth
							autoComplete="on"
							type="password"
							label="New Password"
							error={Boolean(touched.newPassword && errors.newPassword)}
							helperText={(touched.newPassword && errors.newPassword) || 'Password must be minimum 6+'}
						/>

						<TextField
							{...getFieldProps('confirmNewPassword')}
							fullWidth
							autoComplete="on"
							type="password"
							label="Confirm New Password"
							error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
							helperText={touched.confirmNewPassword && errors.confirmNewPassword}
						/>

						<LoadingButton type="submit" variant="contained" loading={isUpdatingMe}>
							Save Changes
						</LoadingButton>
					</Stack>
				</Form>
			</FormikProvider>
		</Card>
	);
}
