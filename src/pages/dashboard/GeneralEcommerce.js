// material
import {Container, Grid} from '@material-ui/core';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {
	EcommerceBestSalesman,
	EcommerceCurrentBalance,
	EcommerceLatestProducts,
	EcommerceNewProducts,
	EcommerceProductSold,
	EcommerceSaleByGender,
	EcommerceSalesOverview,
	EcommerceSalesProfit,
	EcommerceTotalBalance,
	EcommerceWelcome,
	EcommerceYearlySales
} from '../../components/_dashboard/general-ecommerce';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function GeneralEcommerce() {
	const {themeStretch} = useSettings();

	return (
		<Page title="General: E-commerce | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={8}>
						<EcommerceWelcome />
					</Grid>

					<Grid item xs={12} md={4}>
						<EcommerceNewProducts />
					</Grid>

					<Grid item xs={12} md={4}>
						<EcommerceProductSold />
					</Grid>
					<Grid item xs={12} md={4}>
						<EcommerceTotalBalance />
					</Grid>
					<Grid item xs={12} md={4}>
						<EcommerceSalesProfit />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<EcommerceSaleByGender />
					</Grid>

					<Grid item xs={12} md={6} lg={8}>
						<EcommerceYearlySales />
					</Grid>

					<Grid item xs={12} md={6} lg={8}>
						<EcommerceSalesOverview />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<EcommerceCurrentBalance />
					</Grid>

					<Grid item xs={12} md={6} lg={8}>
						<EcommerceBestSalesman />
					</Grid>

					<Grid item xs={12} md={6} lg={4}>
						<EcommerceLatestProducts />
					</Grid>
				</Grid>
			</Container>
		</Page>
	);
}
