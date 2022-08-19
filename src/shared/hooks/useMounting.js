import {useEffect} from 'react';

export const useMounting = (cb, cleanup) => {
	useEffect(() => {
		cb();
		return () => {
			cleanup();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
