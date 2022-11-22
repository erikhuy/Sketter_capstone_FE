/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable spaced-comment */
import React, {useCallback, useEffect, useState} from 'react';
import './AvatarDropzone.css';
import {useDropzone} from 'react-dropzone';
import FlipImageCard from '../flipimagecard/FlipImageCard';
import UploadSVG from '../../assets/img/upload.svg';
import {compress} from '../../utils/ImgTools';

const imageMaxSize = 3000000; //3mb
const AvatarUploadArea = (props) => {
	/**
	 * OnDrop action handler (When you drop an image to this)
	 */
	const [avatarContained, setAvatarContained] = useState('');
	const onDrop = useCallback(
		(acceptedFiles, rejectedFile) => {
			//For each accepted Files, we shall read it
			setAvatarContained('none');
			acceptedFiles.forEach(async (file) => {
				//Compress image
				const compressed_image = await compress(file);

				const reader = new FileReader();

				//On success
				reader.onload = async (event) => {
					//Replicate imageList
					const rep_imageList = [...props.imageList];

					//Add image to the replicate list
					rep_imageList.push({
						image_base64: event.target.result,
						image_title: '',
						image_description: '',
						image_url: '',
						image_file: compressed_image
					});

					//Set state using replicate list
					props.setImageList(rep_imageList);
				};

				reader.readAsDataURL(compressed_image);
			});
		},
		[props]
	);

	/**
	 * Browse button action
	 * @param {*} event
	 */
	const fileSelectedHandler = async (event) => {
		const file = event.target.files[0];
		setAvatarContained('none');

		//Compress image
		const compressed_image = await compress(file);

		//Create a file reader & read as DataURL (Base64)
		const reader = new FileReader();

		reader.readAsDataURL(compressed_image);

		//When file is uploading, disable the button
		//reader.onprogress = () => console.log('ON Progress');

		//When file is successfully loaded
		reader.onload = (event) => {
			//Replicate imageList
			const rep_imageList = [...props.imageList];

			//Add image to the replicate list
			rep_imageList.push({
				image_base64: event.target.result,
				image_title: '',
				image_description: '',
				image_url: '',
				image_file: compressed_image
			});

			//Set state using replicate list
			props.setImageList(rep_imageList);
		};
	};

	const {getRootProps, getInputProps} = useDropzone({
		noClick: true,
		onDrop
	});

	//Change the state of this index
	const onIMGTitleChange = (image_index, title) => {
		//replicate the imageList
		const rep_imageList = props.imageList;
		rep_imageList[image_index].image_title = title;

		//Set back the the state
		props.setImageList(rep_imageList);
	};

	//Change the state of this index
	const onIMGDescriptionChange = (image_index, description) => {
		//replicate the imageList
		const rep_imageList = props.imageList;
		rep_imageList[image_index].image_description = description;

		//Set back the the state
		props.setImageList(rep_imageList);
	};
	useEffect(() => {
		const fetchData = async () => {
			// eslint-disable-next-line no-unused-expressions
			props.imageList.length === 0 ? setAvatarContained('block') : setAvatarContained('none');
		};
		fetchData();
	});
	return (
		<div className="dropzone">
			<div className="dropimage-group">
				{/* Image Flip Card  */}
				{props.imageList.map((image, index) => (
					<FlipImageCard
						key={index}
						// Remove function for Flip card
						remove={(e) => {
							
							setAvatarContained('block');
							e.preventDefault();
							//Replicate
							const rep_imageList = props.imageList;
							//remove index
							rep_imageList.splice(index, 1);
							//Set back to state
							// console.log(rep_imageList);
							props.setImageList(rep_imageList);
						}}
						// eslint-disable-next-line no-nested-ternary
						imageContent={image.image_base64 ? image.image_base64 : image.url ? image.url : image}
						onTitleChange={(event) => onIMGTitleChange(index, event.target.value)}
						onDescriptionChange={(event) => onIMGDescriptionChange(index, event.target.value)}
					/>
				))}
				{/* Image Placeholder for upload */}
				<div className="dropzone-card" style={{display: avatarContained}}>
					<div {...getRootProps({className: 'dropinput'})}>
						<input
							{...getInputProps({
								accept: 'image/*',
								maxLength: imageMaxSize,
								multiple: false
							})}
						/>
						<img className="dropinput-img" src={UploadSVG} alt="upload" />

						<p disabled>Thả ảnh tại đây</p>

						<div className="dropinput-button btn btn-outline-primary">
							Tìm ảnh
							<input type="file" name="file" onChange={fileSelectedHandler} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AvatarUploadArea;
