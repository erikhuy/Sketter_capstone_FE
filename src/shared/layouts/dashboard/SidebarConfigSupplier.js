// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const sidebarConfigSupplier = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: 'Quản lý địa điểm',
		items: [
			{title: 'Danh sách địa điểm', path: PATH_DASHBOARD.destination.destinationList},
			{title: 'Tạo địa điểm', path: PATH_DASHBOARD.destination.createDestination}
		]
	},
	{
		subheader: 'Quản lý khuyến mãi',
		items: [
			{title: 'Danh sách khuyến mãi', path: PATH_DASHBOARD.promotion.promotionList},
			{title: 'Tạo khuyến mãi', path: PATH_DASHBOARD.promotion.createPromotion}
		]
	}
];

export default sidebarConfigSupplier;
