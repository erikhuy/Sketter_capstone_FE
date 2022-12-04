/* eslint-disable prettier/prettier */
import {useNavigate} from 'react-router-dom';
import {Button, Card} from '@material-ui/core';
import {Box} from '@material-ui/system';
import AddIcon from '@material-ui/icons/Add';
import PromotionSortingSelecting from 'pages/components-overview/material-ui/table/sorting-selecting promotion';


export default function PromotionList() {
	const navigate = useNavigate();

	const navigateToAddPromotion = () => {
		navigate('/dashboard/createPromotion');
	};

	return (
		<>
			<Card>
				<PromotionSortingSelecting />
			</Card>
		</>
	);
}
