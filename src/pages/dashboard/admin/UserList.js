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
			<Card>
				<SortingSelecting />
			</Card>
		</>
	);
}
