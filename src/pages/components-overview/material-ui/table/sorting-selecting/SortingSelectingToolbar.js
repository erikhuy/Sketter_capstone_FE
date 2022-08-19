import trash2Fill from '@iconify/icons-eva/trash-2-fill';
import CreateIcon from '@material-ui/icons/Create';
import {Icon} from '@iconify/react';
import {IconButton, Stack, Toolbar, Tooltip, Typography} from '@material-ui/core';
// material
import {styled, useTheme} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {API_URL} from 'shared/constants';
import axios from 'axios';
import {useCallback, useState} from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
	height: 96,
	display: 'flex',
	justifyContent: 'space-between',
	padding: theme.spacing(0, 1, 0, 3)
}));

// ----------------------------------------------------------------------

SortingSelectingToolbar.propTypes = {
	numSelected: PropTypes.any.isRequired,
	reloadData: PropTypes.any,
	idSelected: PropTypes.any.isRequired
};

export default function SortingSelectingToolbar({numSelected, idSelected, reloadData}) {
	const [resetToolbar, setResetToolbar] = useState([]);
	const deleteDestination = useCallback(
		async (idSelected) => {
			try {
				await Promise.all(
					idSelected.map(async (id) => {
						await axios.delete(`${API_URL.Destination}/${id}`).then((res) => {
							if (res.status === 204) {
								reloadData('');
								setResetToolbar('');
							}
						});
					})
				);
			} catch (e) {
				console.log('');
			}
		},
		[resetToolbar]
	);
	const theme = useTheme();
	const isLight = theme.palette.mode === 'light';
	return (
		<RootStyle
			sx={{
				...(numSelected.length > 0 && {
					color: isLight ? 'primary.main' : 'text.primary',
					bgcolor: isLight ? 'primary.lighter' : 'primary.dark'
				})
			}}
		>
			{numSelected.length > 0 ? (
				<Typography color="inherit" variant="subtitle1" component="div">
					{numSelected.length} is selected
				</Typography>
			) : (
				<Typography variant="h6" id="tableTitle" component="div">
					Danh sách địa điểm
				</Typography>
			)}

			{numSelected.length > 0 ? (
				<Stack direction="row" spacing={1}>
					<IconButton
						onClick={() => {
							deleteDestination(idSelected);
						}}
					>
						<Icon icon={trash2Fill} />
					</IconButton>
					<IconButton
						onClick={() => {
							console.log(`update + ${idSelected}`);
						}}
					>
						<CreateIcon />
					</IconButton>
				</Stack>
			) : null}
		</RootStyle>
	);
}
