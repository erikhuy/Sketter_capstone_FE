import editFill from '@iconify/icons-eva/edit-fill';
import {Icon} from '@iconify/react';
// material
import {Button, Card, CardContent, CardHeader, Typography} from '@material-ui/core';
import PropTypes from 'prop-types';
// redux
import {useSelector} from 'shared/redux/store';

// ----------------------------------------------------------------------

CheckoutBillingInfo.propTypes = {
	onBackStep: PropTypes.func
};

export default function CheckoutBillingInfo({onBackStep}) {
	// const { receiver, phone, addressType, fullAddress } = billing;
	const {checkout} = useSelector((state) => state.product);
	const {billing} = checkout;

	return (
		<Card sx={{mb: 3}}>
			<CardHeader
				title="Billing Address"
				action={
					<Button size="small" type="button" startIcon={<Icon icon={editFill} />} onClick={onBackStep}>
						Edit
					</Button>
				}
			/>
			<CardContent>
				<Typography variant="subtitle2" gutterBottom>
					{billing?.receiver}&nbsp;
					<Typography component="span" variant="body2" sx={{color: 'text.secondary'}}>
						({billing?.addressType})
					</Typography>
				</Typography>

				<Typography variant="body2" gutterBottom>
					{billing?.fullAddress}
				</Typography>
				<Typography variant="body2" sx={{color: 'text.secondary'}}>
					{billing?.phone}
				</Typography>
			</CardContent>
		</Card>
	);
}
