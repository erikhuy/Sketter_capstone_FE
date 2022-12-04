// import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from 'components/LoadingScreen';
import {lazy, Suspense} from 'react';
import {Navigate, useLocation, useRoutes} from 'react-router-dom';
import AdminGuard from 'shared/guards/AdminGuard';
import SupplierGuard from 'shared/guards/SupplierGuard';
import SupplierManagerGuard from 'shared/guards/SupplierManagerGuard';
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import MainLayout from '../layouts/main';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const {pathname} = useLocation();
	const isDashboard = pathname.includes('/dashboard');

	return (
		<Suspense
			fallback={
				<LoadingScreen
					sx={{
						...(!isDashboard && {
							top: 0,
							left: 0,
							width: 1,
							zIndex: 9999,
							position: 'fixed'
						})
					}}
				/>
			}
		>
			<Component {...props} />
		</Suspense>
	);
};

export default function Router() {
	return useRoutes([
		{
			path: 'auth',
			children: [
				{
					path: 'login',
					element: (
						<GuestGuard>
							<Login />
						</GuestGuard>
					)
				},
				{
					path: 'register',
					element: (
						<GuestGuard>
							<Register />
						</GuestGuard>
					)
				},
				{path: 'login-unprotected', element: <Login />},
				{path: 'register-unprotected', element: <Register />},
				{path: 'reset-password', element: <ResetPassword />},
				{path: 'reset-new-password/:resetToken', element: <ResetNewPassword />},
				{path: 'verify', element: <VerifyCode />}
			]
		},

		// Dashboard Routes
		{
			path: 'dashboard',
			element: (
				<AuthGuard>
					<DashboardLayout />
				</AuthGuard>
			),
			children: [
				{
					path: '',
					element: (
						<AuthGuard>
							<Navigate to="/dashboard/app" replace />
						</AuthGuard>
					)
				},
				{path: 'app', element: <GeneralApp />},
				{
					path: 'destinationList',
					element: (
						<SupplierGuard>
							<DestinationList />
						</SupplierGuard>
					)
				},
				{
					path: 'createDestination',
					element: (
						<SupplierGuard>
							<CreateDestination />
						</SupplierGuard>
					)
				},
				{
					path: 'createPromotion',
					element: (
						<SupplierGuard>
							<CreatePromotion />
						</SupplierGuard>
					)
				},
				{
					path: 'promotionList',
					element: (
						<SupplierGuard>
							<PromotionList />
						</SupplierGuard>
					)
				},
				{
					path: 'catalogManagement',
					element: (
						<AdminGuard>
							<CatalogManagement />
						</AdminGuard>
					)
				},
				{
					path: 'e-commerce',
					children: [{path: '', element: <Navigate to="/dashboard/e-commerce/shop" replace />}]
				},
				{
					path: 'user',
					children: [
						{path: '', element: <Navigate to="/dashboard/user/profile" replace />},
						{
							path: 'userList',
							element: (
								<AdminGuard>
									<UserList />
								</AdminGuard>
							)
						},
						{
							path: 'createUser',
							element: (
								<AdminGuard>
									<CreateUser />
								</AdminGuard>
							)
						},
						{path: 'account', element: <UserAccount />}
					]
				}
			]
		},

		// Main Routes
		{
			path: '*',
			element: <LogoOnlyLayout />,
			children: [
				{path: '500', element: <Page500 />},
				{path: '404', element: <NotFound />},
				{path: '*', element: <Navigate to="/404" replace />}
			]
		},
		{
			path: '/',
			element: <MainLayout />,
			children: [{path: '', element: <Navigate to="/dashboard" replace />}]
		},
		{path: '*', element: <Navigate to="/404" replace />}
	]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('pages/authentication/Login')));
const Register = Loadable(lazy(() => import('pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('pages/authentication/ResetPassword')));
const ResetNewPassword = Loadable(lazy(() => import('pages/authentication/ResetNewPassword')));
const VerifyCode = Loadable(lazy(() => import('pages/authentication/VerifyCode')));
// Dashboard
const DestinationList = Loadable(lazy(() => import('pages/dashboard/destination/DestinationList')));
const CreateDestination = Loadable(lazy(() => import('pages/dashboard/destination/CreateDestination')));
const UserList = Loadable(lazy(() => import('pages/dashboard/admin/UserList')));
const CreateUser = Loadable(lazy(() => import('pages/dashboard/admin/CreateUser')));
const PromotionList = Loadable(lazy(() => import('pages/dashboard/promotion/PromotionList')));
const CreatePromotion = Loadable(lazy(() => import('pages/dashboard/promotion/CreatePromotion')));
const CatalogManagement = Loadable(lazy(() => import('pages/dashboard/admin/CatalogManagement')));

const GeneralApp = Loadable(lazy(() => import('pages/dashboard/GeneralApp')));
const UserAccount = Loadable(lazy(() => import('pages/dashboard/UserAccount')));
// Main
const Page500 = Loadable(lazy(() => import('pages/Page500')));
const NotFound = Loadable(lazy(() => import('pages/Page404')));
