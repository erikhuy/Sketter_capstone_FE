import refreshFill from '@iconify/icons-eva/refresh-fill';
import {Icon} from '@iconify/react';
// material
import {FormControlLabel, Stack, Switch} from '@material-ui/core';
import PropTypes from 'prop-types';
// components
import {MIconButton} from '../../../../../components/@material-extend';

// ----------------------------------------------------------------------

Toolbar.propTypes = {
	isText: PropTypes.bool,
	isMulti: PropTypes.bool,
	onChangeText: PropTypes.func,
	onChangeMulti: PropTypes.func,
	onRefresh: PropTypes.func
};

export default function Toolbar({isText, isMulti, onChangeText, onChangeMulti, onRefresh, ...other}) {
	return (
		<Stack direction="row" alignItems="center" justifyContent="space-between" {...other}>
			<FormControlLabel control={<Switch checked={isText} onChange={onChangeText} />} label="Text Object" />

			<Stack direction="row" alignItems="center">
				{!isText && (
					<FormControlLabel
						control={<Switch checked={isMulti} onChange={onChangeMulti} />}
						label="Multi Item"
					/>
				)}
				<MIconButton onClick={onRefresh}>
					<Icon icon={refreshFill} width={20} height={20} />
				</MIconButton>
			</Stack>
		</Stack>
	);
}
