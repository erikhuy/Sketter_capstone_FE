/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {styled} from '@material-ui/core/styles';
import Page from 'components/Page';
import useAuth from 'shared/hooks/useAuth';
import CreateUserForm from './CreateUserForm';

const RootStyle = styled(Page)(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex'
	}
}));
export default function CreateDestination() {
	return (
		<RootStyle title="Login | Minimal-UI">
			<CreateUserForm />
		</RootStyle>
	);
}
