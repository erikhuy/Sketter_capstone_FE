/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {styled} from '@material-ui/core/styles';
import Page from 'components/Page';
import useAuth from 'shared/hooks/useAuth';
import CreateDestinationForm from './CreateDestinationForm';
import CreateDestinationFormSupplierManager from './CreateDestinationFormSupplierManager';

const RootStyle = styled(Page)(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex'
	}
}));
export default function CreateDestination() {
	const {user} = useAuth();
	return (
		<RootStyle title="Sketter">
			{user.role.description === 'Quản lý đối tác' ? (
				<CreateDestinationFormSupplierManager />
			) : (
				<CreateDestinationForm />
			)}
		</RootStyle>
	);
}
