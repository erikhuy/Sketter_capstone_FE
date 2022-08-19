// material
import {Box, Button, Card, Grid, Stack, Typography} from '@material-ui/core';
import {useFormik} from 'formik';
import {useSnackbar} from 'notistack5';
import {useState} from 'react';
// redux
import {useSelector} from 'shared/redux/store';
import * as Yup from 'yup';
// utils
import fakeRequest from '../../../../utils/fakeRequest';
//
import AccountBillingAddressBook from './AccountBillingAddressBook';
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory';
import AccountBillingPaymentMethod from './AccountBillingPaymentMethod';

// ----------------------------------------------------------------------

export default function AccountBilling() {
	const {cards, invoices, addressBook} = useSelector((state) => state.user);
	const [open, setOpen] = useState(false);
	const {enqueueSnackbar} = useSnackbar();

	const NewCardSchema = Yup.object().shape({
		cardName: Yup.string().required('Name is required'),
		cardNumber: Yup.string().required('Card number is required'),
		cardExpired: Yup.string().required('Card expired is required'),
		cardCvv: Yup.string().required('Cvv is required')
	});

	const formik = useFormik({
		initialValues: {
			cardName: '',
			cardNumber: '',
			cardExpired: '',
			cardCvv: ''
		},
		validationSchema: NewCardSchema,
		onSubmit: async (values, {setSubmitting, resetForm}) => {
			await fakeRequest(500);
			handleCancel();
			resetForm();
			setSubmitting(false);
			alert(JSON.stringify(values, null, 2));
			enqueueSnackbar('Add card success', {variant: 'success'});
		}
	});

	const handleOpenAddCard = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleCancel = () => {
		setOpen(false);
		formik.resetForm();
	};

	return (
		<Grid container spacing={5}>
			<Grid item xs={12} md={8}>
				<Stack spacing={3}>
					<Card sx={{p: 3}}>
						<Typography variant="overline" sx={{mb: 3, display: 'block', color: 'text.secondary'}}>
							Your Plan
						</Typography>
						<Typography variant="h4">Premium</Typography>
						<Box
							sx={{
								mt: {xs: 2, sm: 0},
								position: {sm: 'absolute'},
								top: {sm: 24},
								right: {sm: 24}
							}}
						>
							<Button size="small" color="inherit" variant="outlined" sx={{mr: 1}}>
								Cancel plan
							</Button>
							<Button size="small" variant="outlined">
								Upgrade plan
							</Button>
						</Box>
					</Card>

					<AccountBillingPaymentMethod
						cards={cards}
						formik={formik}
						isOpen={open}
						onOpen={handleOpenAddCard}
						onCancel={handleCancel}
					/>

					<AccountBillingAddressBook addressBook={addressBook} />
				</Stack>
			</Grid>

			<Grid item xs={12} md={4}>
				<AccountBillingInvoiceHistory invoices={invoices} />
			</Grid>
		</Grid>
	);
}
