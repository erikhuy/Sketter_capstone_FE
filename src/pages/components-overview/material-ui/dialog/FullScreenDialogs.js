import {
	AppBar,
	Button,
	Dialog,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Slide,
	Toolbar,
	Typography
} from '@material-ui/core';
// material
import CloseIcon from '@material-ui/icons/Close';
import {forwardRef, useState} from 'react';

// ----------------------------------------------------------------------

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function FullScreenDialogs() {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button variant="outlined" color="error" onClick={handleClickOpen}>
				Full Screen Dialogs
			</Button>

			<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
				<AppBar position="relative">
					<Toolbar>
						<IconButton color="inherit" edge="start" onClick={handleClose}>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" sx={{flex: 1, ml: 2}}>
							Sound
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							Save
						</Button>
					</Toolbar>
				</AppBar>
				<List>
					<ListItemButton>
						<ListItemText primary="Phone ringtone" secondary="Titania" />
					</ListItemButton>

					<Divider />

					<ListItemButton>
						<ListItemText primary="Default notification ringtone" secondary="Tethys" />
					</ListItemButton>
				</List>
			</Dialog>
		</>
	);
}
