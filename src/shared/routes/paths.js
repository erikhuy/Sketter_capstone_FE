// ----------------------------------------------------------------------

function path(root, sublink) {
	return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
	root: ROOTS_AUTH,
	login: path(ROOTS_AUTH, '/login'),
	loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
	register: path(ROOTS_AUTH, '/register'),
	registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
	resetPassword: path(ROOTS_AUTH, '/reset-password'),
	resetNewPassword: path(ROOTS_AUTH, '/reset-new-password'),
	verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {
	comingSoon: '/coming-soon',
	maintenance: '/maintenance',
	pricing: '/pricing',
	payment: '/payment',
	about: '/about-us',
	faqs: '/faqs',
	page404: '/404',
	page500: '/500',
	components: '/components'
};

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
	general: {
		app: path(ROOTS_DASHBOARD, '/app'),
		ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
		analytics: path(ROOTS_DASHBOARD, '/analytics')
	},
	destination: {
		destinationList: path(ROOTS_DASHBOARD, '/destinationList'),
		createDestination: path(ROOTS_DASHBOARD, '/createDestination'),
		pendingDestinationList: path(ROOTS_DASHBOARD, '/pendingDestinationList'),
		rejectDestinationList: path(ROOTS_DASHBOARD, '/rejectDestinationList'),
		testZalo: path(ROOTS_DASHBOARD, '/testZalo')
	},
	promotion: {
		promotionList: path(ROOTS_DASHBOARD, '/promotionList'),
		createPromotion: path(ROOTS_DASHBOARD, '/createPromotion')
	},
	catalog: {
		catalogManagement: path(ROOTS_DASHBOARD, '/catalogManagement')
	},
	mail: {
		root: path(ROOTS_DASHBOARD, '/mail'),
		all: path(ROOTS_DASHBOARD, '/mail/all')
	},
	chat: {
		root: path(ROOTS_DASHBOARD, '/chat'),
		new: path(ROOTS_DASHBOARD, '/chat/new'),
		conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey')
	},
	kanban: path(ROOTS_DASHBOARD, '/kanban'),
	user: {
		root: path(ROOTS_DASHBOARD, '/user'),
		profile: path(ROOTS_DASHBOARD, '/user/profile'),
		userList: path(ROOTS_DASHBOARD, '/user/userList'),
		createUser: path(ROOTS_DASHBOARD, '/user/createUser'),
		account: path(ROOTS_DASHBOARD, '/user/account')
	}
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
