/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import './FlipImageCard.css';

import RemovePNG from '../../assets/img/remove.png';
/**
 * Props must have
 * {
 *    id,
 *    imageSrc,
 *    imageTitle,
 *    imageDescription
 * }
 */
const FlipImageCard = (props) => {
	const [flip, setFlip] = useState(false);

	return (
		// The classname of flipcard is dynamic, if it is flipped
		//  The class change to flipcard-flip, and it will flip the card
		//  CSS file will also writes 2 class for both flipcard and flipcard-flip
		<div className={`flipcard${  flip ? '-flip' : ''}`}>
			{/* Inner container for flipcard */}
			<div className="flipcard--inner">
				<div className="flipcard--front">
					<div className="flipcard--img">
						<img src={props.imageContent} alt="Dalat" />
					</div>
				</div>

				<div className="flipcard--back">
					<textarea
						type="text"
						className="flipcard--description__title"
						placeholder="Tiêu đề"
						onChange={props.onTitleChange}
					/>
					<textarea
						placeholder="Viết một vài mô tả"
						className="flipcard--description__content"
						onChange={props.onDescriptionChange}
					/>
				</div>
			</div>

			<div className="flipcard--groupbutton">
				{/* Button for remove */}
				<button className="flipcard--remove" onClick={props.remove}>
					<img src={RemovePNG} alt="remove" />
				</button>
			</div>
		</div>
	);
};

export default FlipImageCard;
