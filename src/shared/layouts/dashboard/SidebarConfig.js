// routes
import {PATH_DASHBOARD} from 'shared/routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const sidebarConfig = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: 'Quản lý địa điểm',
		items: [
			{title: 'Danh sách địa điểm', path: PATH_DASHBOARD.destination.destinationList},
			{title: 'Tạo địa điểm', path: PATH_DASHBOARD.destination.createDestination},
			{title: 'Địa điểm chờ duyệt', path: PATH_DASHBOARD.destination.pendingDestinationList},
			{title: 'Địa điểm bị từ chối', path: PATH_DASHBOARD.destination.rejectDestinationList}
		]
	}
];

export default sidebarConfig;
