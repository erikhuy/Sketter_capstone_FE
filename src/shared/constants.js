export const AppContext = {
	Auth: 'AUTH',
	User: 'USER'
};
const BASE_URL = 'https://sketter-smart-planner.herokuapp.com';

export const ACCESS_TOKEN_KEY = 'accessToken';

// export const API_URL = {
// 	V1: `/api/v1/`,
// 	User: `/api/v1/users`,
// 	Destination: `/api/v1/destinations`,
// 	Auth: `/api/v1/auth`,
// 	Cata: `/api/v1/catalogs`,
// 	PT: `/api/v1/personalities`,
// 	City: `/api/v1/cities`,
// 	TimeFrames: `/api/v1/time_frames`,
// 	Voucher: `/api/v1/vouchers`
// };
export const API_URL = {
	V1: `${BASE_URL}/api/v1/`,
	User: `${BASE_URL}/api/v1/users`,
	Destination: `${BASE_URL}/api/v1/destinations`,
	Auth: `${BASE_URL}/api/v1/auth`,
	Cata: `${BASE_URL}/api/v1/catalogs`,
	PT: `${BASE_URL}/api/v1/personalities`,
	City: `${BASE_URL}/api/v1/cities`,
	TimeFrames: `${BASE_URL}/api/v1/time_frames`,
	Voucher: `${BASE_URL}/api/v1/vouchers`
};
