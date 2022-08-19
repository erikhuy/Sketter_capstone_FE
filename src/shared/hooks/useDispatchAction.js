import {useCallback} from 'react';
import {useDispatch} from 'react-redux';

export const useDispatchAction = (action) => {
	const dispatch = useDispatch();
	return useCallback((...payload) => dispatch(action(...payload)), [action, dispatch]);
};
