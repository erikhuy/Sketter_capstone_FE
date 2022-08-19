import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Container,
	FormControlLabel,
	Stack,
	Switch,
	Typography
} from '@material-ui/core';
// material
import {styled} from '@material-ui/core/styles';
import {useCallback, useState} from 'react';
// routes
import {PATH_PAGE} from 'shared/routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// components
import Page from '../../../components/Page';
import {UploadAvatar, UploadMultiFile, UploadSingleFile} from '../../../components/upload';
// utils
import {fData} from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
	paddingTop: theme.spacing(11),
	paddingBottom: theme.spacing(15)
}));

export default function Upload() {
	const [preview, setPreview] = useState(false);
	const [files, setFiles] = useState([]);
	const [file, setFile] = useState(null);
	const [avatarUrl, setAvatarUrl] = useState('');

	const handleDropSingleFile = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			setFile({
				...file,
				preview: URL.createObjectURL(file)
			});
		}
	}, []);

	const handleDropAvatar = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			setAvatarUrl({
				...file,
				preview: URL.createObjectURL(file)
			});
		}
	}, []);

	const handleDropMultiFile = useCallback(
		(acceptedFiles) => {
			setFiles(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file)
					})
				)
			);
		},
		[setFiles]
	);

	const handleRemoveAll = () => {
		setFiles([]);
	};

	const handleRemove = (file) => {
		const filteredItems = files.filter((_file) => _file !== file);
		setFiles(filteredItems);
	};

	return (
		<RootStyle title="Components: Upload | Minimal-UI">
			<Box
				sx={{
					pt: 6,
					pb: 1,
					mb: 10,
					bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800')
				}}
			>
				<Container maxWidth="lg">
					<HeaderBreadcrumbs
						heading="Upload"
						links={[{name: 'Components', href: PATH_PAGE.components}, {name: 'Upload'}]}
						moreLink="https://react-dropzone.js.org/#section-basic-example"
					/>
				</Container>
			</Box>

			<Container maxWidth="lg">
				<Stack spacing={5}>
					<Card>
						<CardHeader
							title="Upload Multi File"
							action={
								<FormControlLabel
									control={
										<Switch
											checked={preview}
											onChange={(event) => setPreview(event.target.checked)}
										/>
									}
									label="Show Preview"
								/>
							}
						/>
						<CardContent>
							<UploadMultiFile
								showPreview={preview}
								files={files}
								onDrop={handleDropMultiFile}
								onRemove={handleRemove}
								onRemoveAll={handleRemoveAll}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader title="Upload Single File" />
						<CardContent>
							<UploadSingleFile file={file} onDrop={handleDropSingleFile} />
						</CardContent>
					</Card>

					<Card>
						<CardHeader title="Upload Avatar" />
						<CardContent>
							<UploadAvatar
								accept="image/*"
								file={avatarUrl}
								onDrop={handleDropAvatar}
								caption={
									<Typography
										variant="caption"
										sx={{
											mt: 2,
											mx: 'auto',
											display: 'block',
											textAlign: 'center',
											color: 'text.secondary'
										}}
									>
										Allowed *.jpeg, *.jpg, *.png, *.gif
										<br /> max size of {fData(3145728)}
									</Typography>
								}
							/>
						</CardContent>
					</Card>
				</Stack>
			</Container>
		</RootStyle>
	);
}
