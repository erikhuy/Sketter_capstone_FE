/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {styled} from '@material-ui/core/styles';
import Page from 'components/Page';
import CreateDestinationForm from './CreateDestinationForm';

const RootStyle = styled(Page)(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex'
	}
}));
export default function CreateDestination() {
	return (
		<RootStyle title="Login | Minimal-UI">
			<CreateDestinationForm />
		</RootStyle>
	);
}

