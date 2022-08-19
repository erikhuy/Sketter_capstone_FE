import get from 'lodash/get';
import {AppContext} from 'shared/constants';
import {createSlice, isAnyOf, isRejected} from '@reduxjs/toolkit';
import {fetchUserThunk, loginThunk, registerThunk, updateMeThunk, updatePasswordThunk} from '../thunks/auth';

export const initialAuthState = {
	user: null,
	/**
	 * Store the auth error message
	 * - null -> mean nothing
	 * - empty string -> auth success
	 * - string -> indicates the auth is failed and also store the error message
	 */
	errorMessage: null,
	isInitialized: false,
	isAuthenticated: false,
	updateMeErrorMessage: null,
	updatePasswordErrorMessage: null,
	registerErrorMessage: null
};

const isUpdateMeFulfilledMatcher = isAnyOf(updateMeThunk.fulfilled);
const isUpdatePasswordFulfilledMatcher = isAnyOf(updatePasswordThunk.fulfilled);
const isRegisterFulfilledMatcher = isAnyOf(registerThunk.fulfilled);

export const authSlice = createSlice({
	name: AppContext.Auth,
	initialState: initialAuthState,
	reducers: {
		initializeAuth() {
			return {
				...initialAuthState,
				isInitialized: true
			};
		},
		cleanUpUIState(state) {
			return {
				...state,
				errorMessage: null,
				updateMeErrorMessage: null
			};
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserThunk.rejected, (state) => ({
				...state,
				isAuthenticated: false
			}))
			.addMatcher(isAnyOf(updateMeThunk.pending, updateMeThunk.rejected), (state, action) => ({
				...state,
				updateMeErrorMessage: isRejected(action) ? get(action, 'payload.data.message', null) : null
			}))
			.addMatcher(isAnyOf(updatePasswordThunk.pending, updatePasswordThunk.rejected), (state, action) => ({
				...state,
				updatePasswordErrorMessage: isRejected(action) ? get(action, 'payload.data.message', null) : null
			}))
			.addMatcher(isAnyOf(registerThunk.pending, registerThunk.rejected), (state, action) => ({
				...state,
				registerdErrorMessage: isRejected(action) ? get(action, 'payload.data.message', null) : null
			}))
			.addMatcher(
				isAnyOf(
					loginThunk.fulfilled,
					fetchUserThunk.fulfilled,
					updateMeThunk.fulfilled,
					updatePasswordThunk.fulfilled,
					registerThunk.fulfilled
				),
				(state, action) => ({
					...state,
					errorMessage: isAnyOf(loginThunk.fulfilled, fetchUserThunk.fulfilled)(action) ? '' : null,
					user: {
						...state.user,
						...action.payload
					},
					isInitialized: true,
					isAuthenticated: true,
					updateMeErrorMessage: isUpdateMeFulfilledMatcher(action) ? '' : null,
					updatePasswordErrorMessage: isUpdatePasswordFulfilledMatcher(action) ? '' : null,
					registerErrorMessage: isUpdatePasswordFulfilledMatcher(action) ? '' : null
				})
			)
			.addMatcher(isAnyOf(loginThunk.rejected, loginThunk.pending), (state, action) => ({
				...state,
				errorMessage: isRejected(action) ? get(action, 'payload.data.message', null) : null,
				isAuthenticated: false
			}));
	}
});

export const {initializeAuth, cleanUpUIState: cleanUpUIStateAction} = authSlice.actions;
export default authSlice.reducer;
