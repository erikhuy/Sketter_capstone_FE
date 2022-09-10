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
		analytics: path(ROOTS_DASHBOARD, '/analytics'),
		userManagement: path(ROOTS_DASHBOARD, '/userManagement')
	},
	destination: {
		destinationList: path(ROOTS_DASHBOARD, '/destinationList'),
		createDestination: path(ROOTS_DASHBOARD, '/createDestination')
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
	calendar: path(ROOTS_DASHBOARD, '/calendar'),
	kanban: path(ROOTS_DASHBOARD, '/kanban'),
	user: {
		root: path(ROOTS_DASHBOARD, '/user'),
		profile: path(ROOTS_DASHBOARD, '/user/profile'),
		cards: path(ROOTS_DASHBOARD, '/user/cards'),
		list: path(ROOTS_DASHBOARD, '/user/list'),
		newUser: path(ROOTS_DASHBOARD, '/user/new'),
		editById: path(ROOTS_DASHBOARD, '/user/ada-lindgren/edit'),
		account: path(ROOTS_DASHBOARD, '/user/account')
	},
	eCommerce: {
		root: path(ROOTS_DASHBOARD, '/e-commerce'),
		product: path(ROOTS_DASHBOARD, '/e-commerce/product/:name'),
		productById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
		list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
		newProduct: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
		editById: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
		checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
		invoice: path(ROOTS_DASHBOARD, '/e-commerce/invoice')
	},
	blog: {
		root: path(ROOTS_DASHBOARD, '/blog'),
		posts: path(ROOTS_DASHBOARD, '/blog/posts'),
		post: path(ROOTS_DASHBOARD, '/blog/post/:title'),
		postById: path(ROOTS_DASHBOARD, '/blog/post/portfolio-review-is-this-portfolio-too-creative'),
		newPost: path(ROOTS_DASHBOARD, '/blog/new-post')
	}
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
