import {Autocomplete, Box, CircularProgress, TextField, Typography} from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import {throttle} from 'lodash';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from 'react';
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

const SearchItem = ({option, ...props}) => {
	const matches = option.structured_formatting.main_text_matched_substrings;
	const parts = useMemo(
		() =>
			parse(
				option.structured_formatting.main_text,
				matches.map((match) => [match.offset, match.offset + match.length])
			),
		[option.structured_formatting.main_text, matches]
	);

	return (
		<li {...props}>
			<Box display="flex" flexDirection="column">
				<Box display="inline">
					{parts.map((part, index) => (
						<span
							key={index}
							style={{
								fontWeight: part.highlight ? 700 : 400
							}}
						>
							{part.text}
						</span>
					))}
				</Box>
				<Typography variant="body2" color="text.secondary">
					{option.structured_formatting.secondary_text}
				</Typography>
			</Box>
		</li>
	);
};

const SearchBar = ({onSelect, isError, error, helperText, fieldProps, forwardedRef, placeAddress}) => {
	const {placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading} = usePlacesService({
		apiKey: process.env.REACT_APP_GOOGLE_KEY,
		debounce: 500,
		options: {
			language: 'vi',
			componentRestrictions: {
				country: 'VN'
			}
		}
	});
	const [value, setValue] = useState(null);

	const fetchPredictions = useMemo(
		() => throttle((input) => getPlacePredictions({input}), 200),
		[getPlacePredictions]
	);
	const onChange = useCallback((_, value) => console.log(value), []);
	const onInputChange = useCallback(
		(_, newInputValue) => {
			console.log(newInputValue);
			fetchPredictions(newInputValue);
		},
		[fetchPredictions]
	);
	const isOptionEqualToValue = useCallback(
		(option, value) => option && value && option.description === value.description,
		[]
	);

	useImperativeHandle(
		forwardedRef,
		() => ({
			clearSearch: () => setValue(null)
		}),
		[]
	);

	useEffect(() => {
		console.log(placeAddress);
		setValue({
			description: placeAddress,
			matched_substrings: [],
			place_id: '',
			reference: '',
			structured_formatting: {main_text: '', main_text_matched_substrings: [], secondary_text: ''},
			terms: [],
			types: []
		});
		const placeId = value && value.place_id;
		const address = value && value.description;
		if (placeId) {
			placesService?.getDetails({placeId, address}, ({geometry: {location}}) => {
				onSelect({
					lat: location.lat(),
					lng: location.lng(),
					googlePlaceId: placeId,
					destinationAddress: address
				});
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	return (
		<Autocomplete
			autoSelect
			autoComplete
			autoHighlight
			filterSelectedOptions
			size="small"
			loading={isPlacePredictionsLoading}
			getOptionLabel={(option) => option.description}
			filterOptions={(x) => x}
			options={placePredictions}
			onChange={onChange}
			value={value}
			isOptionEqualToValue={isOptionEqualToValue}
			renderInput={(params) => (
				<TextField
					fullWidth
					{...params}
					{...fieldProps}
					error={isError}
					helperText={isError ? error : helperText}
				/>
			)}
			onInputChange={onInputChange}
			renderOption={(props, option) => <SearchItem key={option.place_id} {...props} option={option} />}
			loadingText={<CircularProgress size={20} />}
			sx={{
				position: 'absolute',
				top: '16px',
				left: '16px',
				backgroundColor: 'common.white',
				zIndex: 2,
				maxWidth: '320px',
				width: '100%'
			}}
		/>
	);
};

const MemoizedSearchBar = React.memo(SearchBar);
export default forwardRef((props, ref) => <MemoizedSearchBar {...props} forwardedRef={ref} />);
