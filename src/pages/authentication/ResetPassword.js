// layouts
import {Box, Button, Container, Typography} from '@material-ui/core';
// material
import {styled} from '@material-ui/core/styles';
import {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
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

export default function ResetPassword() {
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);

	return (
		<RootStyle title="Sketter">
			<LogoOnlyLayout />

			<Container>
				<Box sx={{maxWidth: 480, mx: 'auto'}}>
					{!sent ? (
						<>
							<Typography variant="h3" paragraph>
								Quên mật khẩu ?
							</Typography>
							<Typography sx={{color: 'text.secondary', mb: 5}}>
								Xin hãy nhập địa chỉ email đúng với tài khoản mà bạn yêu cầu. Chúng tôi sẽ gửi một email
								kèm đường dẫn đổi mật khẩu mới đến cho bạn
							</Typography>

							<ResetByEmailForm onSent={() => setSent(true)} onGetEmail={(value) => setEmail(value)} />

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
