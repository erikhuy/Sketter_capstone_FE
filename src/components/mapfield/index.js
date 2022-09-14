/* eslint-disable no-unused-expressions */
import {useLoadScript, GoogleMap, Marker, MarkerF} from '@react-google-maps/api';
import React, {useCallback, useRef, useEffect} from 'react';
import {useField} from 'formik';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import {Alert, Box, CircularProgress, IconButton} from '@material-ui/core';
import {geocodeByPlaceId} from 'react-places-autocomplete';
import SearchBar from './SearchBar';

const options = {
	disableDefaultUI: true,
	zoomControl: true
};
const libraries = ['places'];
const MAPS_KEY = 'AIzaSyBJUprJ0tR5rBnHp-9yRAzbWCA4ft_8Xww';
const DEFAULT_CENTER = {lat: 10.8411276, lng: 106.809883};

const MapField = ({containerProps = {}, ...props}) => {
	const {name, ...fieldProps} = props;
	const [_, meta, helpers] = useField({name});
	const {setValue: setFieldValue} = helpers;
	const {error, touched, value} = meta;
	const {isLoaded, loadError} = useLoadScript({
		googleMapsApiKey: MAPS_KEY,
		libraries
	});

	const onMapClick = useCallback(
		(e) => {
			geocodeByPlaceId(e.placeId)
				.then((results) =>
					setFieldValue({
						lat: e.latLng.lat(),
						lng: e.latLng.lng(),
						destinationAddress: results[0].formatted_address,
						time: new Date()
					})
				)
				.catch((error) => console.error(error));

			searchRef.current && searchRef.current.clearSearch();
		},
		[setFieldValue]
	);

	const mapRef = useRef(null);
	const searchRef = useRef(null);
	const onMapLoad = useCallback(
		(map) => {
			mapRef.current = map;
			if (value) {
				map.panTo(value);
			}
		},
		[value]
	);

	useEffect(() => {
		if (mapRef.current && value) {
			mapRef.current.panTo(value);
		}
		console.log(value);
	}, [value]);

	if (loadError) return <Alert severity="error">Failed to load the map</Alert>;
	if (!isLoaded) return <CircularProgress />;

	return (
		<Box
			{...containerProps}
			sx={{
				position: 'relative',
				width: '100%',
				minHeight: '320px',
				height: '320px',
				...containerProps.sx
			}}
		>
			<IconButton
				sx={{
					position: 'absolute',
					top: '16px',
					right: '8px',
					zIndex: 1,
					backgroundColor: 'common.white'
				}}
				onClick={() => {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							console.log(position.coords);
							if (mapRef.current) {
								const location = {
									lat: position.coords.latitude,
									lng: position.coords.longitude,
									description: ''
								};
								mapRef.current.panTo(location);
								setFieldValue(location);
							}
						},
						() => null
					);
				}}
			>
				<MyLocationIcon />
			</IconButton>
			<SearchBar
				ref={searchRef}
				// dùng để load địa chỉ từ data và từ khi onClick vào map
				placeAddress={value ? value.destinationAddress : ''}
				error={error}
				fieldProps={fieldProps}
				onSelect={setFieldValue}
				isError={touched && error}
			/>
			<GoogleMap
				zoom={16}
				center={DEFAULT_CENTER}
				mapContainerStyle={{width: '100%', height: '100%'}}
				options={options}
				onClick={onMapClick}
				onLoad={onMapLoad}
			>
				{value && <MarkerF position={value} />}
			</GoogleMap>
		</Box>
	);
};

export default React.memo(MapField);
