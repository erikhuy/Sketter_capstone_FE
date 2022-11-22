import {Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
// material
import {visuallyHidden} from '@material-ui/utils';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

SortingSelectingHead.propTypes = {
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
	numSelected: PropTypes.number.isRequired,
	headLabel: PropTypes.array.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(['asc', 'desc']).isRequired
};

export default function SortingSelectingHead({
	order,
	orderBy,
	rowCount,
	headLabel,
	numSelected,
	onRequestSort,
	onSelectAllClick
}) {
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Box
						sx={{
							width: 0
						}}
					/>
				</TableCell>
				{headLabel.map((headCell) => (
					<TableCell
						key={headCell.id}
						align="left"
						style={{paddingLeft: 25}}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={{...visuallyHidden}}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}
