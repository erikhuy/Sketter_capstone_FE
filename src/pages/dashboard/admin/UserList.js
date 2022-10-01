/* eslint-disable prettier/prettier */
import {useNavigate} from 'react-router-dom';
import {Button, Card} from '@material-ui/core';
import {Box} from '@material-ui/system';
import AddIcon from '@material-ui/icons/Add';
import SortingSelecting from '../../components-overview/material-ui/table/sorting-selecting admin';


export default function UserListManagement() {
	const navigate = useNavigate();

	const navigateToAddUser = () => {
		navigate('/dashboard/user/createUser');
	};

	return (
		<>
			<Box sx={{mb: 3, display: 'flex', justifyContent: 'flex-end'}}>
				<Button
					variant="contained"
					color="success"
					startIcon={<AddIcon />}
					sx={{color: 'white'}}
					onClick={navigateToAddUser}
				>
					Thêm tài khoản
				</Button>
			</Box>
			<Card>
				<SortingSelecting />
			</Card>
		</>
	);
}
