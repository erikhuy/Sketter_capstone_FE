// material
import {Box, Container, Link, Typography} from '@material-ui/core';
import {Outlet, useLocation} from 'react-router-dom';
import {Link as ScrollLink} from 'react-scroll';
// components
import Logo from '../../../components/Logo';
import MainFooter from './MainFooter';
//
import MainNavbar from './MainNavbar';

// ----------------------------------------------------------------------

export default function MainLayout() {
	return (
		<>
			<div>
				<Outlet />
			</div>
		</>
	);
}
