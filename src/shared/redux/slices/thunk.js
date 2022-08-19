import Immutable from 'seamless-immutable';

const initialAsyncActionsState = {
	currentActions: {},
	numberOfRequests: 0
};

export const getActionName = (actionType) => actionType.split('/').slice(0, -1).join('/');

const thunkActionsReducer = (state = initialAsyncActionsState, action) => {
	const {type} = action;
	const actionName = getActionName(type);
	const immutableState = Immutable(state);

	if (type.endsWith('/pending')) {
		return immutableState
			.set('numberOfRequests', (previousState) => previousState + 1)
			.setIn(['currentActions', actionName], true);
	}

	if (type.endsWith('/fulfilled') || type.endsWith('/rejected')) {
		return immutableState
			.set('numberOfRequests', (previousState) => (previousState > 0 ? previousState - 1 : 0))
			.update('currentActions', (previousState) => Immutable(previousState).without(actionName));
	}

	return state;
};

export default thunkActionsReducer;
