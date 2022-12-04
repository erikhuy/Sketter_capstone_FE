/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {styled} from '@material-ui/core/styles';
import Page from 'components/Page';
import CreatePromotionForm from './CreatePromotionForm';

const RootStyle = styled(Page)(({theme}) => ({
	[theme.breakpoints.up('md')]: {
		display: 'flex'
	}
}));
export default function CreatePromotion() {
	return (
		<RootStyle title="Sketter">
			<CreatePromotionForm />
		</RootStyle>
	);
}
