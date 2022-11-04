import closeFill from '@iconify/icons-eva/close-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import {Icon} from '@iconify/react';
// material
import {
	Alert,
	Autocomplete,
	Box,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField
} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import axios from 'axios';
import {Form, FormikProvider, useFormik} from 'formik';
import {isNull} from 'lodash';
import {useSnackbar} from 'notistack5';
import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {API_URL} from 'shared/constants';
import {useDispatchAction} from 'shared/hooks';
// hooks
import useAuth from 'shared/hooks/useAuth';
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import {registerThunk} from 'shared/redux/thunks/auth';
import * as Yup from 'yup';
//

// ----------------------------------------------------------------------

export default function CreateUserForm() {
	const {registerErrorMessage} = useAuth();
	const isMountedRef = useIsMountedRef();
	const {enqueueSnackbar} = useSnackbar();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const navigate = useNavigate();

	const CreateUserSchema = Yup.object().shape({
		phone: Yup.string()
			.matches(/^[0-9]+$/, 'Yêu cầu nhập số điện thoại')
			.min(7, 'Số điện thoại không hợp lệ!')
			.max(13, 'Số điện thoại không hợp lệ!')
			.required('Yêu cầu nhập số điện thoại'),
		address: Yup.string().min(5, 'Địa chỉ không hợp lệ').required('Yêu cầu nhập địa chỉ'),
		owner: Yup.string()
			.min(2, 'Tên chủ sở hữu không hợp lệ!')
			.max(50, 'Tên chủ sở hữu không hợp lệ!')
			.required('Yêu cầu nhập tên chủ sở hữu'),
		name: Yup.string()
			.min(2, 'Tên hiển thị không hợp lệ!')
			.max(50, 'Tên hiển thị không hợp lệ!')
			.required('Yêu cầu nhập tên hiển thị'),
		email: Yup.string().email('Email không hợp lệ').required('Yêu cầu nhập email'),
		password: Yup.string()
			.min(6, 'Mật khẩu có ít nhất 6 ký tự')
			.max(16, 'Mật khẩu có không quá 16 ký tự')
			.required('Yêu cầu mật khẩu'),
		confirmPassword: Yup.string()
			.required('Yêu cầu xác nhận mật khẩu')
			.oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
		roleName: Yup.string().required('Yêu cầu nhập quyền')
	});

	const formik = useFormik({
		initialValues: {
			phone: '',
			address: '',
			owner: '',
			name: '',
			password: '',
			confirmPassword: '',
			email: '',
			roleName: ''
		},
		validationSchema: CreateUserSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				console.log(values);
				await createUser(values);
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
	const createUser = useCallback(async (data) => {
		console.log(data);
		try {
			await axios.post(`${API_URL.User}`, data).then((res) => {
				console.log(res.data);
				navigate('/dashboard/user/userList');
				enqueueSnackbar('Tạo người dùng thành công', {variant: 'success'});
			});
		} catch (e) {
			console.log(e.response.data.message);
			enqueueSnackbar(e.response.data.message, {variant: 'error'});
		}
	});
	const {errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue} = formik;

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<div
					style={{
						position: 'absolute',
						left: '55%',
						top: '50%',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<Stack direction={{xs: 'column'}} spacing={3.6} sx={{m: 2}}>
						<h1 className="page-title text-center font-weight-bold">Tạo tài khoản</h1>
						<TextField
							style={{height: 56, width: 460}}
							fullWidth
							type="email"
							label="Email*"
							{...getFieldProps('email')}
							error={Boolean(touched.email && errors.email)}
							helperText={touched.email && errors.email}
						/>
						<TextField
							style={{height: 56, width: 460}}
							fullWidth
							type={showPassword ? 'text' : 'password'}
							label="Mật khẩu*"
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
							style={{height: 56, width: 460}}
							fullWidth
							type={showConfirmPassword ? 'text' : 'password'}
							label="Nhập lại mật khẩu*"
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
							style={{height: 56, width: 460}}
							fullWidth
							type="text"
							label="Tên*"
							{...getFieldProps('name')}
							error={Boolean(touched.name && errors.name)}
							helperText={touched.name && errors.name}
						/>
						<TextField
							fullWidth
							type="text"
							label="Chủ sở hữu*"
							{...getFieldProps('owner')}
							error={Boolean(touched.owner && errors.owner)}
							helperText={touched.owner && errors.owner}
						/>
						<TextField
							fullWidth
							type="text"
							label="Số điện thoại*"
							{...getFieldProps('phone')}
							error={Boolean(touched.phone && errors.phone)}
							helperText={touched.phone && errors.phone}
						/>
						<TextField
							fullWidth
							type="text"
							label="Địa chỉ*"
							{...getFieldProps('address')}
							error={Boolean(touched.address && errors.address)}
							helperText={touched.address && errors.address}
						/>
						<FormControl sx={{m: 1, minWidth: 80}}>
							<InputLabel id="demo-simple-select-label">Vai trò*</InputLabel>
							<Select
								style={{height: 56, width: 460}}
								labelId="demo-simple-select-label"
								id="demo-simple-select"
								label="Vai trò*"
								onChange={(e, value) => {
									setFieldValue('roleName', value.props.value);
									console.log(value.props.value);
								}}
							>
								<MenuItem value="Khách du lịch">Khách du lịch</MenuItem>
								<MenuItem value="Đối tác">Đối tác</MenuItem>
								<MenuItem value="Quản lý đối tác">Quản lý đối tác</MenuItem>
							</Select>
							<FormHelperText error>{touched.roleName && errors.roleName}</FormHelperText>
						</FormControl>
						<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
							Tạo tài khoản
						</LoadingButton>
					</Stack>
				</div>
			</Form>
		</FormikProvider>
	);
}
