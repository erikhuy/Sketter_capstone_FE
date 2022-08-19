/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
import imageCompression from 'browser-image-compression';

/**
 * Compress and reduce the size of image
 * @param {*} image_BLOB
 */
export const compress = async (image_BLOB) => {
	const options = {
		maxSizeMB: 0.6,
		maxWidthOrHeight: 800,
		useWebWorker: true
	};

	let compressed = null;
	try {
		compressed = await imageCompression(image_BLOB, options);
	} catch (error) {
		console.log(error);
	}

	return compressed;
};
