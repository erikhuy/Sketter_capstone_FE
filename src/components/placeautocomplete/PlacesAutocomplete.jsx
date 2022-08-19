/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import {TextField} from '@material-ui/core';
import React from 'react';
import PlacesSuggestion, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';

const PlacesAutocomplete = (props) => {
	/* This function support address search field */
	const onAddressChange = (address) => {
		const rep_location = props.location;
		rep_location.address = address;

		props.updateLocation(rep_location);
	};

	/**
	 * This function is when autosuggestion field is clicked from Google Places API
	 * It will set the states such as address, coordinates and the viewport of Mapbox
	 *
	 * @param {*} value
	 */
	const selectHandler = async (value) => {
		/* Geocode by Address */
		const results = await geocodeByAddress(value);

		/* LatLng is the first result */
		const latLng = await getLatLng(results[0]);

		// Update form state
		props.updateLocation({
			address: value,
			coordinates: [latLng.lat, latLng.lng]
		});
	};

	return (
		<PlacesSuggestion value={props.location.address} onChange={onAddressChange} onSelect={selectHandler}>
			{({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
				<div className="form-group">
					{/* Input field for Suggestion */}
					<TextField
						className="form-control"
						required
						name="address"
						onChange={(event) => onAddressChange(event.target.value)}
						style={{height: 56, width: 320}}
						label={<span className="labelText">Địa chỉ</span>}
						InputLabelProps={{
							shrink: true,
							className: 'labelText2 '
						}}
						InputProps={{
							className: 'text-field-style',
							placeholder: 'Thêm địa chỉ',
							autoComplete: 'nope',
							...getInputProps()
						}}
					/>


					{/* Autocomplete popup */}
					<div className="autocomplete">
						<ul className="autocomplete-items">
							{loading ? <li className="autocomplete-content">...loading...</li> : null}

							{/* Suggestions Area */}
							{suggestions.map(
								/* Each suggestion */
								(suggestion) => {
									const style = {
										backgroundColor: suggestion.active ? '#355C7D' : '#fff',
										color: suggestion.active ? '#F8B195' : '#000'
									};
									return (
										<li
											className="autocomplete-content"
											{...getSuggestionItemProps(suggestion, {style})}
										>
											{suggestion.description}
										</li>
									);
								}
							)}
						</ul>
					</div>
				</div>
			)}
		</PlacesSuggestion>
	);
};

export default PlacesAutocomplete;
