import PropTypes from 'prop-types';
import {useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {PATH_DASHBOARD} from 'shared/routes/paths';
// pages
import Login from '../../pages/authentication/Login';
import GeneralApp from '../../pages/dashboard/GeneralApp';

// hooks
import useAuth from '../hooks/useAuth';

AdminGuard.propTypes = {
	children: PropTypes.node
};

export default function AdminGuard({children}) {
	const {isAuthenticated, user} = useAuth();
	const {pathname} = useLocation();
	const [requestedLocation, setRequestedLocation] = useState(null);

	if (!isAuthenticated) {
		console.log('yesAdmin');
		return <Login />;
	}
	if (!(user.role.description === 'Quản trị viên')) {
		console.log('yesAdmin');
		return <Navigate to="/dashboard/app" />;
	}
	if (requestedLocation && pathname !== requestedLocation) {
		setRequestedLocation(null);
		return <Navigate to={requestedLocation} />;
	}

	return <>{children}</>;
}
