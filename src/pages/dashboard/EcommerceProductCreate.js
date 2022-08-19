// material
import {Container} from '@material-ui/core';
import {paramCase} from 'change-case';
import {useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
// hooks
import useSettings from 'shared/hooks/useSettings';
import {getProducts} from 'shared/redux/slices/product';
// redux
import {useDispatch, useSelector} from 'shared/redux/store';
// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
import ProductNewForm from '../../components/_dashboard/e-commerce/ProductNewForm';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// components
import Page from '../../components/Page';

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
	const {themeStretch} = useSettings();
	const dispatch = useDispatch();
	const {pathname} = useLocation();
	const {name} = useParams();
	const {products} = useSelector((state) => state.product);
	const isEdit = pathname.includes('edit');
	const currentProduct = products.find((product) => paramCase(product.name) === name);

	useEffect(() => {
		dispatch(getProducts());
	}, [dispatch]);

	return (
		<Page title="Ecommerce: Create a new product | Minimal-UI">
			<Container maxWidth={themeStretch ? false : 'lg'}>
				<HeaderBreadcrumbs
					heading={!isEdit ? 'Create a new product' : 'Edit product'}
					links={[
						{name: 'Dashboard', href: PATH_DASHBOARD.root},
						{
							name: 'E-Commerce',
							href: PATH_DASHBOARD.eCommerce.root
						},
						{name: !isEdit ? 'New product' : name}
					]}
				/>

				<ProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
			</Container>
		</Page>
	);
}
