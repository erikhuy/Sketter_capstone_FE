import checkmarkFill from '@iconify/icons-eva/checkmark-fill';
import {Icon} from '@iconify/react';
// material
import {Box, Container, Grid, Step, StepConnector, StepLabel, Stepper} from '@material-ui/core';
import {withStyles} from '@material-ui/styles';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
// hooks
import useIsMountedRef from 'shared/hooks/useIsMountedRef';
import useSettings from 'shared/hooks/useSettings';
import {createBilling, getCart} from 'shared/redux/slices/product';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import {
	CheckoutBillingAddress,
	CheckoutCart,
	CheckoutOrderComplete,
	CheckoutPayment
} from '../../components/_dashboard/e-commerce/checkout';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

const STEPS = ['Cart', 'Billing & address', 'Payment'];

const QontoConnector = withStyles((theme) => ({
	alternativeLabel: {
		top: 10,
		left: 'calc(-50% + 20px)',
		right: 'calc(50% + 20px)'
	},
	active: {
		'& $line': {borderColor: theme.palette.primary.main}
	},
	completed: {
		'& $line': {borderColor: theme.palette.primary.main}
	},
	line: {
		borderTopWidth: 2,
		borderColor: theme.palette.divider
	}
}))(StepConnector);

QontoStepIcon.propTypes = {
	active: PropTypes.bool,
	completed: PropTypes.bool
};

function QontoStepIcon({active, completed}) {
	return (
		<Box
			sx={{
				zIndex: 9,
				width: 24,
				height: 24,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: active ? 'primary.main' : 'divider',
				bgcolor: 'background.default'
			}}
		>
			{completed ? (
				<Box
					component={Icon}
					icon={checkmarkFill}
					sx={{zIndex: 1, width: 20, height: 20, color: 'primary.main'}}
				/>
			) : (
				<Box
					sx={{
						width: 8,
						height: 8,
						borderRadius: '50%',
						backgroundColor: 'currentColor'
					}}
				/>
			)}
		</Box>
	);
}

export default function EcommerceCheckout() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const isMountedRef = useIsMountedRef();
	const {checkout} = useSelector((state) => state.product);
	const {cart, billing, activeStep} = checkout;
	const isComplete = activeStep === STEPS.length;

	useEffect(() => {
		if (isMountedRef.current) {
			dispatch(getCart(cart));
		}
	}, [dispatch, isMountedRef, cart]);

	useEffect(() => {
		if (activeStep === 1) {
			dispatch(createBilling(null));
		}
	}, [dispatch, activeStep]);

	return (
		<Page title="Ecommerce: Checkout | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading="Checkout"
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{
							name: 'E-Commerce',
							href: PATH_DASHBOARD.eCommerce.root
						},
						{name: 'Checkout'}
					]}
				/>

				<Grid container justifyContent={isComplete ? 'center' : 'flex-start'}>
					<Grid item xs={12} md={8} sx={{mb: 5}}>
						<Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
							{STEPS.map((label) => (
								<Step key={label}>
									<StepLabel
										StepIconComponent={QontoStepIcon}
										sx={{
											'& .MuiStepLabel-label': {
												typography: 'subtitle2',
												color: 'text.disabled'
											}
										}}
									>
										{label}
									</StepLabel>
								</Step>
							))}
						</Stepper>
					</Grid>
				</Grid>

				{!isComplete ? (
					<>
						{activeStep === 0 && <CheckoutCart />}
						{activeStep === 1 && <CheckoutBillingAddress />}
						{activeStep === 2 && billing && <CheckoutPayment />}
					</>
				) : (
					<CheckoutOrderComplete open={isComplete} />
				)}
			</Container>
		</Page>
	);
}
