import {Box, Card, Container, Link, Stack, Tooltip, Typography} from '@material-ui/core';
import {styled} from '@material-ui/core/styles';
import {capitalCase} from 'change-case';
import {MHidden} from 'components/@material-extend';
import {LoginForm} from 'components/authentication/login';
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

export default function Login() {
	const {method} = useAuth();

	return (
		<RootStyle title="Sketter">
			<AuthLayout>
				Không có tài khoản ? &nbsp;
				<Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
					Bắt đầu
				</Link>
			</AuthLayout>

			<MHidden width="mdDown">
				<SectionStyle>
					<Typography variant="h3" sx={{px: 5, mt: 10, mb: 5}}>
						Hi, Chào mừng trở lại
					</Typography>
					<img src="/static/illustrations/illustration_login.png" alt="login" />
				</SectionStyle>
			</MHidden>
			<Container maxWidth="sm">
				<ContentStyle>
					<Stack direction="row" alignItems="center" sx={{mb: 5}}>
						<Box sx={{flexGrow: 1}}>
							<Typography variant="h4" gutterBottom>
								Đăng ký Sketter
							</Typography>
							<Typography sx={{color: 'text.secondary'}}>Nhập thông tin tài khoản.</Typography>
						</Box>
					</Stack>
					<LoginForm />
					<MHidden width="smUp">
						<Typography variant="body2" align="center" sx={{mt: 3}}>
							Không có tài khoản ?&nbsp;
							<Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
								Bắt đầu
							</Link>
						</Typography>
					</MHidden>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
}
