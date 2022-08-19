import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import {Icon} from '@iconify/react';
// material
import {Button, Grid} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {Form, FormikProvider, useFormik} from 'formik';
import {applyShipping, onBackStep, onGotoStep, onNextStep} from 'shared/redux/slices/product';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
import * as Yup from 'yup';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
//
import CheckoutSummary from './CheckoutSummary';

// ----------------------------------------------------------------------

const DELIVERY_OPTIONS = [
	{
		value: 0,
		title: 'Standard delivery (Free)',
		description: 'Delivered on Monday, August 12'
	},
	{
		value: 2,
		title: 'Fast delivery ($2,00)',
		description: 'Delivered on Monday, August 5'
	}
];

const PAYMENT_OPTIONS = [
	{
		value: 'paypal',
		title: 'Pay with Paypal',
		description: 'You will be redirected to PayPal website to complete your purchase securely.',
		icons: ['/static/icons/ic_paypal.svg']
	},
	{
		value: 'credit_card',
		title: 'Credit / Debit Card',
		description: 'We support Mastercard, Visa, Discover and Stripe.',
		icons: ['/static/icons/ic_mastercard.svg', '/static/icons/ic_visa.svg']
	},
	{
		value: 'cash',
		title: 'Cash on CheckoutDelivery',
		description: 'Pay with cash when your order is delivered.',
		icons: []
	}
];

const CARDS_OPTIONS = [
	{value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland'},
	{value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes'},
	{value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong'}
];

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
	const dispatch = useDispatch();
	const {checkout} = useSelector((state) => state.product);
	const {total, discount, subtotal, shipping} = checkout;

	const handleNextStep = () => {
		dispatch(onNextStep());
	};

	const handleBackStep = () => {
		dispatch(onBackStep());
	};

	const handleGotoStep = (step) => {
		dispatch(onGotoStep(step));
	};

	const handleApplyShipping = (value) => {
		dispatch(applyShipping(value));
	};

	const PaymentSchema = Yup.object().shape({
		payment: Yup.mixed().required('Payment is required')
	});

	const formik = useFormik({
		initialValues: {
			delivery: shipping,
			payment: ''
		},
		validationSchema: PaymentSchema,
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				handleNextStep();
			} catch (error) {
				console.error(error);
				setSubmitting(false);
				setErrors(error.message);
			}
		}
	});

	const {isSubmitting, handleSubmit} = formik;

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<CheckoutDelivery
							formik={formik}
							onApplyShipping={handleApplyShipping}
							deliveryOptions={DELIVERY_OPTIONS}
						/>
						<CheckoutPaymentMethods
							formik={formik}
							cardOptions={CARDS_OPTIONS}
							paymentOptions={PAYMENT_OPTIONS}
						/>
						<Button
							type="button"
							size="small"
							color="inherit"
							onClick={handleBackStep}
							startIcon={<Icon icon={arrowIosBackFill} />}
						>
							Back
						</Button>
					</Grid>

					<Grid item xs={12} md={4}>
						<CheckoutBillingInfo onBackStep={handleBackStep} />
						<CheckoutSummary
							enableEdit
							total={total}
							subtotal={subtotal}
							discount={discount}
							shipping={shipping}
							onEdit={() => handleGotoStep(0)}
						/>
						<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
							Complete Order
						</LoadingButton>
					</Grid>
				</Grid>
			</Form>
		</FormikProvider>
	);
}
