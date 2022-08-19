import {Box, Card, Container, Link, Tooltip, Typography} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {capitalCase} from 'change-case';
import {MHidden} from 'components/@material-extend';
import AuthFirebaseSocials from 'components/authentication/AuthFirebaseSocial';
import {RegisterForm} from 'components/authentication/register';
import Page from 'components/Page';
import {Link as RouterLink} from 'react-router-dom';
import useAuth from 'shared/hooks/useAuth';
import AuthLayout from 'shared/layouts/AuthLayout';
import {PATH_AUTH} from 'shared/routes/paths';

const RootStyle = styled(Page)(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex'
	}
}));

const SectionStyle = styled(Card)(({theme}) => ({
	width: '100%',
	maxWidth: 464,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({theme}) => ({
	maxWidth: 480,
	margin: 'auto',
	display: 'flex',
	minHeight: '100vh',
	flexDirection: 'column',
	justifyContent: 'center',
	padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
	const {method} = useAuth();

	return (
		<RootStyle title="Register | Minimal-UI">
			<AuthLayout>
				Đã có tài khoản ? &nbsp;
				<Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
					Đăng nhập
				</Link>
			</AuthLayout>

			<MHidden width="mdDown">
				<SectionStyle>
					<Typography variant="h3" sx={{px: 5, mt: 10, mb: 5}}>
						Đăng ký để trải nghiệm Sketter
					</Typography>
					<img alt="register" src="/static/illustrations/illustration_register.png" />
				</SectionStyle>
			</MHidden>

			<Container>
				<ContentStyle>
					<Box sx={{mb: 5, display: 'flex', alignItems: 'center'}}>
						<Box sx={{flexGrow: 1}}>
							<h1>Đăng ký tài khoản</h1>
						</Box>
					</Box>

					{method === 'firebase' && <AuthFirebaseSocials />}

					<RegisterForm />

					<Typography variant="body2" align="center" sx={{color: 'text.secondary', mt: 3}}>
						Bằng cách đăng ký tài khoảng, bạn đồng ý với&nbsp;
						<Link underline="always" color="text.primary" href="#">
							Điều khoản
						</Link>
						&nbsp;and&nbsp;
						<Link underline="always" color="text.primary" href="#">
							Dịch vụ
						</Link>
						.
					</Typography>

					<MHidden width="smUp">
						<Typography variant="subtitle2" sx={{mt: 3, textAlign: 'center'}}>
							Đã có tài khoản ?&nbsp;
							<Link to={PATH_AUTH.login} component={RouterLink}>
								Đăng nhập
							</Link>
						</Typography>
					</MHidden>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
}
