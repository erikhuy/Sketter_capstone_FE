// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const sidebarConfigAdmin = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: 'Quản lý tài khoản',
		items: [
			{title: 'Danh sách tài khoản', path: PATH_DASHBOARD.user.userList},
			{title: 'Tạo tài khoản', path: PATH_DASHBOARD.user.createUser}
		]
	},
	{
		subheader: 'Quản lý loại địa điểm',
		items: [{title: 'Quản lý loại địa điểm', path: PATH_DASHBOARD.catalog.catalogManagement}]
	}
];

export default sidebarConfigAdmin;
