import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import {Icon} from '@iconify/react';
// material
import {Button, Card, CardHeader, Grid, Typography} from '@material-ui/core';
import {Form, FormikProvider, useFormik} from 'formik';
import {sum} from 'lodash';
import {Link as RouterLink} from 'react-router-dom';
import {applyDiscount, decreaseQuantity, deleteCart, increaseQuantity, onNextStep} from 'shared/redux/slices/product';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import EmptyContent from '../../../EmptyContent';
//
import Scrollbar from '../../../Scrollbar';
import CheckoutProductList from './CheckoutProductList';
import CheckoutSummary from './CheckoutSummary';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
	const dispatch = useDispatch();
	const {checkout} = useSelector((state) => state.product);
	const {cart, total, discount, subtotal} = checkout;
	const isEmptyCart = cart.length === 0;

	const handleDeleteCart = (productId) => {
		dispatch(deleteCart(productId));
	};

	const handleNextStep = () => {
		dispatch(onNextStep());
	};

	const handleApplyDiscount = (value) => {
		dispatch(applyDiscount(value));
	};

	const handleIncreaseQuantity = (productId) => {
		dispatch(increaseQuantity(productId));
	};

	const handleDecreaseQuantity = (productId) => {
		dispatch(decreaseQuantity(productId));
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {products: cart},
		onSubmit: async (values, {setErrors, setSubmitting}) => {
			try {
				setSubmitting(true);
				handleNextStep();
			} catch (error) {
				console.error(error);
				setErrors(error.message);
			}
		}
	});

	const {values, handleSubmit} = formik;
	const totalItems = sum(values.products.map((item) => item.quantity));

	return (
		<FormikProvider value={formik}>
			<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<Card sx={{mb: 3}}>
							<CardHeader
								title={
									<Typography variant="h6">
										Card
										<Typography component="span" sx={{color: 'text.secondary'}}>
											&nbsp;({totalItems} item)
										</Typography>
									</Typography>
								}
								sx={{mb: 3}}
							/>

							{!isEmptyCart ? (
								<Scrollbar>
									<CheckoutProductList
										formik={formik}
										onDelete={handleDeleteCart}
										onIncreaseQuantity={handleIncreaseQuantity}
										onDecreaseQuantity={handleDecreaseQuantity}
									/>
								</Scrollbar>
							) : (
								<EmptyContent
									title="Cart is empty"
									description="Look like you have no items in your shopping cart."
									img="/static/illustrations/illustration_empty_cart.svg"
								/>
							)}
						</Card>

						<Button
							color="inherit"
							component={RouterLink}
							to={PATH_DASHBOARD.eCommerce.root}
							startIcon={<Icon icon={arrowIosBackFill} />}
						>
							Continue Shopping
						</Button>
					</Grid>

					<Grid item xs={12} md={4}>
						<CheckoutSummary
							total={total}
							enableDiscount
							discount={discount}
							subtotal={subtotal}
							onApplyDiscount={handleApplyDiscount}
						/>
						<Button
							fullWidth
							size="large"
							type="submit"
							variant="contained"
							disabled={values.products.length === 0}
						>
							Check Out
						</Button>
					</Grid>
				</Grid>
			</Form>
		</FormikProvider>
	);
}
