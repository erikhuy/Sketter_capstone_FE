import {createAsyncThunk} from '@reduxjs/toolkit';

export const createAsyncThunkWithErrorHandler = (typePrefix, payloadCreator, options = {}) =>
	createAsyncThunk(
		typePrefix,
		async (payload, thunkAPI) => {
			try {
				return await payloadCreator(payload, thunkAPI);
			} catch (err) {
				return thunkAPI.rejectWithValue(err.response);
			}
		},
		options
	);
