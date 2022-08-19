import {useMemo} from 'react';
import {useSelector} from 'react-redux';

export const useLoading = (actions) => {
	const {currentActions} = useSelector((state) => state.thunk);
	return useMemo(() => actions.every(({typePrefix}) => currentActions[typePrefix]), [actions, currentActions]);
};
