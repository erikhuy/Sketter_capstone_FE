import {Box} from '@material-ui/core';
// material
import {styled, useTheme} from '@material-ui/core/styles';
import faker from 'faker';
import PropTypes from 'prop-types';
import {useRef} from 'react';
import Slider from 'react-slick';
// utils
import {mockImgFeed} from 'utils/mockImages';
//
import {CarouselControlsArrowsBasic2, CarouselControlsPaging2} from './controls';

// ----------------------------------------------------------------------

const CAROUSELS = [...Array(5)].map((_, index) => {
	const setIndex = index + 1;
	return {
		title: faker.name.title(),
		description: faker.lorem.paragraphs(),
		image: mockImgFeed(setIndex)
	};
});

const RootStyle = styled('div')(({theme}) => ({
	position: 'relative',
	'& .slick-list': {
		boxShadow: theme.customShadows.z16,
		borderRadius: theme.shape.borderRadiusMd
	}
}));

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
	item: PropTypes.object
};

function CarouselItem({item}) {
	const {image, title} = item;

	return <Box component="img" alt={title} src={image} sx={{width: '100%', height: 480, objectFit: 'cover'}} />;
}

export default function CarouselBasic3() {
	const theme = useTheme();
	const carouselRef = useRef();

	const settings = {
		speed: 500,
		dots: true,
		arrows: false,
		autoplay: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		rtl: Boolean(theme.direction === 'rtl'),
		...CarouselControlsPaging2({
			sx: {mt: 3}
		})
	};

	const handlePrevious = () => {
		carouselRef.current.slickPrev();
	};

	const handleNext = () => {
		carouselRef.current.slickNext();
	};

	return (
		<RootStyle>
			<Slider ref={carouselRef} {...settings}>
				{CAROUSELS.map((item) => (
					<CarouselItem key={item.title} item={item} />
				))}
			</Slider>
			<CarouselControlsArrowsBasic2 onNext={handleNext} onPrevious={handlePrevious} />
		</RootStyle>
	);
}
