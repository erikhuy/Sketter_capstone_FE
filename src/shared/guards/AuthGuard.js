import PropTypes from 'prop-types';
import {useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
// pages
import Login from '../../pages/authentication/Login';
import GeneralApp from '../../pages/dashboard/GeneralApp';

// hooks
import useAuth from '../hooks/useAuth';

AuthGuard.propTypes = {
	children: PropTypes.node
};

export default function AuthGuard({children}) {
	const {isAuthenticated, user} = useAuth();
	const {pathname} = useLocation();
	const [requestedLocation, setRequestedLocation] = useState(null);

	if (!isAuthenticated) {
		console.log('yesAuth');
		if (pathname !== requestedLocation) {
			setRequestedLocation(pathname);
		}
		return <Login />;
	}

	if (requestedLocation && pathname !== requestedLocation) {
		setRequestedLocation(null);
		return <Navigate to={requestedLocation} />;
	}

	return <>{children}</>;
}
