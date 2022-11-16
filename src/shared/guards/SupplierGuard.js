import PropTypes from 'prop-types';
import {useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {PATH_DASHBOARD} from 'shared/routes/paths';
// pages
import Login from '../../pages/authentication/Login';
import GeneralApp from '../../pages/dashboard/GeneralApp';

// hooks
import useAuth from '../hooks/useAuth';

SupplierGuard.propTypes = {
	children: PropTypes.node
};

export default function SupplierGuard({children}) {
	const {isAuthenticated, user} = useAuth();
	const {pathname} = useLocation();
	const [requestedLocation, setRequestedLocation] = useState(null);

	if (!isAuthenticated) {
		console.log('yesSM');
		return <Login />;
	}
	if (user.role.description !== 'Quản lý' && user.role.description !== 'Đối tác') {
		console.log('yesSM');
		return <Navigate to="/dashboard/app" />;
	}
	if (requestedLocation && pathname !== requestedLocation) {
		setRequestedLocation(null);
		return <Navigate to={requestedLocation} />;
	}

	return <>{children}</>;
}
