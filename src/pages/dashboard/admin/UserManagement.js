/* eslint-disable prettier/prettier */
import {useNavigate} from 'react-router-dom';
import {Button, Card} from '@material-ui/core';
import {Box} from '@material-ui/system';
import AddIcon from '@material-ui/icons/Add';
import SortingSelecting from '../../components-overview/material-ui/table/sorting-selecting';


export default function UserManegement() {
	const navigate = useNavigate();

	const navigateToAddDestination = () => {
		navigate('/dashboard/user/account');
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
				<SortingSelecting />
			</Card>
		</>
	);
}
