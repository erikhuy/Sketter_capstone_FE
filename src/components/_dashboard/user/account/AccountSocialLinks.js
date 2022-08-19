import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import {Icon} from '@iconify/react';
// material
import {Card, InputAdornment, Stack, TextField} from '@material-ui/core';
import {LoadingButton} from '@material-ui/lab';
import {Form, FormikProvider, useFormik} from 'formik';
import {useSnackbar} from 'notistack5';
// redux
import {useSelector} from 'shared/redux/store';
// utils
import fakeRequest from '../../../../utils/fakeRequest';

// ----------------------------------------------------------------------

const SOCIAL_LINKS_OPTIONS = [
	{
		value: 'facebookLink',
		icon: <Icon icon={facebookFill} height={24} />
	},
	{
		value: 'instagramLink',
		icon: <Icon icon={instagramFilled} height={24} />
	},
	{
		value: 'linkedinLink',
		icon: <Icon icon={linkedinFill} height={24} />
	},
	{
		value: 'twitterLink',
		icon: <Icon icon={twitterFill} height={24} />
	}
];

// ----------------------------------------------------------------------

export default function AccountSocialLinks() {
	const {enqueueSnackbar} = useSnackbar();
	const {myProfile} = useSelector((state) => state.user);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			facebookLink: myProfile.facebookLink,
			instagramLink: myProfile.instagramLink,
			linkedinLink: myProfile.linkedinLink,
			twitterLink: myProfile.twitterLink
		},
		onSubmit: async (values, {setSubmitting}) => {
			await fakeRequest(500);
			setSubmitting(false);
			alert(JSON.stringify(values, null, 2));
			enqueueSnackbar('Save success', {variant: 'success'});
		}
	});

	const {handleSubmit, isSubmitting, getFieldProps} = formik;

	return (
		<Card sx={{p: 3}}>
			<FormikProvider value={formik}>
				<Form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Stack spacing={3} alignItems="flex-end">
						{SOCIAL_LINKS_OPTIONS.map((link) => (
							<TextField
								key={link.value}
								fullWidth
								{...getFieldProps(link.value)}
								InputProps={{
									startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>
								}}
							/>
						))}

						<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
							Save Changes
						</LoadingButton>
					</Stack>
				</Form>
			</FormikProvider>
		</Card>
	);
}
