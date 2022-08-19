import {useCallback, useEffect} from 'react';
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
import {UploadAvatar} from '../../../upload';

export default function AccountGeneral() {
	const updateMe = useDispatchAction(updateMeThunk);
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const {user, updateMeErrorMessage} = useAuth();
	const cleanUpUIState = useDispatchAction(cleanUpUIStateAction);
	const isUpdatingMe = useLoading([updateMeThunk]);

	const UpdateUserSchema = Yup.object().shape({
		name: Yup.string().required('Name is required')
	});

	useEffect(
		() => () => {
			cleanUpUIState();
		},
		[]
	);

	useEffect(() => {
		if (isNull(updateMeErrorMessage)) {
			return;
		}

		const message = updateMeErrorMessage || 'Update success';
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
			try {
				updateMe(values);
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
						<Card sx={{py: 10, px: 3, textAlign: 'center'}}>
							<UploadAvatar
								accept="image/*"
								file={values.avatar}
								maxSize={3145728}
								onDrop={handleDrop}
								error={Boolean(touched.photoURL && errors.photoURL)}
								caption={
									<Typography
										variant="caption"
										sx={{
											mt: 2,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.secondary'
										}}
									>
										Allowed *.jpeg, *.jpg, *.png, *.gif
										<br /> max size of {fData(3145728)}
									</Typography>
								}
							/>

							<FormHelperText error sx={{px: 2, textAlign: 'center'}}>
								{touched.photoURL && errors.photoURL}
							</FormHelperText>
						</Card>
					</Grid>

					<Grid item xs={12} md={8}>
						<Card sx={{p: 3}}>
							<Stack spacing={{xs: 2, md: 3}}>
								<Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
									<TextField fullWidth label="Name" {...getFieldProps('name')} />
									<TextField fullWidth disabled label="Email Address" {...getFieldProps('email')} />
								</Stack>

								<Stack direction={{xs: 'column', md: 'row'}} spacing={2}>
									<TextField fullWidth label="Phone Number" {...getFieldProps('phone')} />
									<TextField fullWidth label="Address" {...getFieldProps('address')} />
								</Stack>
							</Stack>
							<Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
								<LoadingButton type="submit" variant="contained" loading={isUpdatingMe}>
									Save Changes
								</LoadingButton>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Form>
		</FormikProvider>
	);
}
