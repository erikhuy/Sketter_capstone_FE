// layouts
import {Box, Button, Container, Typography} from '@material-ui/core';
// material
import {styled} from '@material-ui/core/styles';
import ResetNewPasswordForm from 'components/authentication/reset-new-password/ResetNewPasswordForm';
import {useState} from 'react';
import {Link as RouterLink, useParams, useNavigate} from 'react-router-dom';
import LogoOnlyLayout from 'shared/layouts/LogoOnlyLayout';
// routes
import {PATH_AUTH} from 'shared/routes/paths';
//
import {SentIcon} from '../../assets';
import {ResetByEmailForm} from '../../components/authentication/reset-password';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	display: 'flex',
	minHeight: '100%',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ResetNewPassword() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const {resetToken} = useParams();
	const navigate = useNavigate();
	return (
		<RootStyle title="Reset Password | Minimal UI">
			<LogoOnlyLayout />

			<Container>
				<Box sx={{maxWidth: 480, mx: 'auto'}}>
					{!sent ? (
						<>
							<Typography variant="h3" paragraph>
								Nhập mật khẩu mới
							</Typography>

							<ResetNewPasswordForm
								onSent={() => setSent(true)}
								onGetEmail={(value) => setEmail(value)}
								sendResetToken={resetToken}
							/>

							<Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{mt: 1}}>
								Quay lại
							</Button>
						</>
					) : (
						<Box sx={{textAlign: 'center'}}>
							<SentIcon sx={{mb: 5, mx: 'auto', height: 160}} />

							<Typography variant="h3" gutterBottom>
								Gửi thành công
							</Typography>
							<Typography>
								Chúng tôi đã gửi mail đến &nbsp;
								<strong>{email}</strong>
								<br />
								Xin hãy kiểm tra hòm thư.
							</Typography>

							<Button
								size="large"
								variant="contained"
								component={RouterLink}
								to={PATH_AUTH.login}
								sx={{mt: 5}}
							>
								Quay Lại
							</Button>
						</Box>
					)}
				</Box>
			</Container>
		</RootStyle>
	);
}
