/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-curly-brace-presence */
import {useNavigate} from 'react-router-dom';
import {Button, Card} from '@material-ui/core';
import {Box} from '@material-ui/system';
import AddIcon from '@material-ui/icons/Add';
import SortingSelectingSupplierManager from 'pages/components-overview/material-ui/table/sorting-selecting supplier manager';

export default function RejectDestinationList() {
	const navigate = useNavigate();

	const navigateToAddDestination = () => {
		navigate('/dashboard/createDestination');
	};

	return (
		<>
			<Box sx={{mb: 3, display: 'flex', justifyContent: 'flex-end'}}>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					sx={{color: 'white'}}
					onClick={navigateToAddDestination}
				>
					Thêm địa điểm
				</Button>
			</Box>
			<Card>
				<SortingSelectingSupplierManager listType={'reject'} />
			</Card>
		</>
	);
}
