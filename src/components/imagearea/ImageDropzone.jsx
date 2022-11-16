/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable spaced-comment */
import React, {useCallback, useEffect} from 'react';
import './ImageDropzone.css';
import {useDropzone} from 'react-dropzone';
import {useSnackbar} from 'notistack5';
import FlipImageCard from '../flipimagecard/FlipImageCard';
import UploadSVG from '../../assets/img/upload.svg';
import {compress} from '../../utils/ImgTools';

const imageMaxSize = 3000000; //3mb
const fileImage = () => {
	// console.log(document.getElementById('file').value);
	document.getElementById('file').value = '';
};
const ImageUploadArea = (props) => {
	const {enqueueSnackbar} = useSnackbar();

	/**
	 * OnDrop action handler (When you drop an image to this)
	 */
	const onDrop = useCallback(
		(acceptedFiles, rejectedFile) => {
			//For each accepted Files, we shall read it
			console.log(acceptedFiles);
			acceptedFiles.forEach(async (file) => {
				//Compress image
				try {
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
				} catch (e) {
					enqueueSnackbar('Vui lòng chọn hình ảnh hợp lệ (.jpeg, .png)', {variant: 'error'});
				}
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

		//Compress image
		console.log(file);

		if (file) {
			// const validImageTypes = ['image/jpeg', 'image/png'];
			// if (validImageTypes.includes(file.type)) {
			// }
			// fileImage();
			try {
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
			} catch (e) {
				enqueueSnackbar('Vui lòng chọn hình ảnh hợp lệ (.jpeg, .png)', {variant: 'error'});
			}
		}
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

	return (
		<div className="dropzone">
			<div className="dropimage-group">
				{/* Image Flip Card  */}
				{props.imageList.map((image, index) => (
					<FlipImageCard
						key={index}
						// Remove function for Flip card
						remove={(e) => {
							fileImage();
							e.preventDefault();
							//Replicate
							const rep_imageList = props.imageList;
							//remove index
							rep_imageList.splice(index, 1);

							//Set back to state
							props.setImageList(rep_imageList);
						}}
						imageContent={image.image_base64 ? image.image_base64 : image.url}
						onTitleChange={(event) => onIMGTitleChange(index, event.target.value)}
						onDescriptionChange={(event) => onIMGDescriptionChange(index, event.target.value)}
					/>
				))}
				{/* Image Placeholder for upload */}
				<div className="dropzone-card">
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
							<input type="file" name="file" id="file" onChange={fileSelectedHandler} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageUploadArea;
